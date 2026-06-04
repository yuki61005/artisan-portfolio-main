import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------------- Public reads (no auth) ----------------

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { search?: string; tag?: string; category?: string } | undefined) =>
    z
      .object({
        search: z.string().max(120).optional(),
        tag: z.string().max(60).optional(),
        category: z.string().max(60).optional(),
      })
      .optional()
      .parse(d),
  )
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("posts")
      .select(
        "id, slug, title, excerpt, cover_image, category, tags, reading_minutes, view_count, published_at",
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(200);

    if (data?.tag) q = q.contains("tags", [data.tag]);
    if (data?.category) q = q.eq("category", data.category);
    if (data?.search) {
      const s = data.search.replace(/[%_]/g, "");
      q = q.or(`title.ilike.%${s}%,excerpt.ilike.%${s}%`);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const incrementPostView = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.rpc("increment_post_view", { _slug: data.slug });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllTags = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("tags, category")
    .eq("published", true);
  if (error) throw new Error(error.message);
  const tags = new Set<string>();
  const cats = new Set<string>();
  for (const r of data ?? []) {
    (r.tags ?? []).forEach((t: string) => tags.add(t));
    if (r.category) cats.add(r.category);
  }
  return { tags: [...tags].sort(), categories: [...cats].sort() };
});

// ---------------- Admin (auth + role check) ----------------

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });

export const listAllPostsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("id, slug, title, published, published_at, view_count, updated_at, category")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getPostByIdAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const PostInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(400).optional().nullable(),
  content: z.string().max(200000),
  cover_image: z.string().url().optional().nullable().or(z.literal("")),
  category: z.string().max(60).optional().nullable(),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
  published: z.boolean().default(false),
});

function readingMinutesOf(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PostInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const reading_minutes = readingMinutesOf(data.content);
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content,
      cover_image: data.cover_image || null,
      category: data.category ?? null,
      tags: data.tags,
      reading_minutes,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
      author_id: context.userId,
    };

    if (data.id) {
      const existing = await supabaseAdmin
        .from("posts")
        .select("published_at, published")
        .eq("id", data.id)
        .maybeSingle();
      // Preserve original published_at if already published
      if (existing.data?.published && existing.data.published_at) {
        payload.published_at = existing.data.published_at;
      }
      const { data: row, error } = await supabaseAdmin
        .from("posts")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row;
    }

    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
