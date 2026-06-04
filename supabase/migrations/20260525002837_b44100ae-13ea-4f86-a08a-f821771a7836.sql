
-- Add search_path to set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- Revoke execute on internal helpers (used only inside RLS / triggers)
revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

-- Keep increment_post_view publicly executable (intentional)
grant execute on function public.increment_post_view(text) to anon, authenticated;
