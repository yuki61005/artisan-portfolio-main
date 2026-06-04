import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/projects", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.9" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
        ];
        const { data: posts } = await supabaseAdmin
          .from("posts")
          .select("slug, published_at")
          .eq("published", true)
          .order("published_at", { ascending: false });

        const urls = [
          ...staticPaths.map((e) => entry(e.path, undefined, e.changefreq, e.priority)),
          ...(posts ?? []).map((p) => entry(`/blog/${p.slug}`, p.published_at ?? undefined, "monthly", "0.7")),
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls, `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

function entry(path: string, lastmod?: string, changefreq?: string, priority?: string) {
  return [
    `  <url>`,
    `    <loc>${BASE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    `  </url>`,
  ].filter(Boolean).join("\n");
}
