
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles_select_own" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_public_read" on public.profiles for select using (true);
create policy "profiles_self_update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check (id = auth.uid());

-- Auto-create profile + first user becomes admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  user_count int;
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  select count(*) into user_count from auth.users;
  if user_count = 1 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  category text,
  tags text[] not null default '{}',
  reading_minutes int not null default 1,
  view_count int not null default 0,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

create policy "posts_public_read_published" on public.posts
  for select using (published = true);
create policy "posts_admin_read_all" on public.posts
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "posts_admin_insert" on public.posts
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "posts_admin_update" on public.posts
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "posts_admin_delete" on public.posts
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create index posts_published_at_idx on public.posts (published_at desc) where published = true;
create index posts_slug_idx on public.posts (slug);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- View counter: increment via security definer function, public access
create or replace function public.increment_post_view(_slug text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.posts set view_count = view_count + 1
  where slug = _slug and published = true;
end;
$$;
grant execute on function public.increment_post_view(text) to anon, authenticated;
