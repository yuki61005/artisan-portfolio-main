import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { format } from "date-fns";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { getPublishedPostBySlug, incrementPostView } from "@/lib/posts.functions";
import { MarkdownView } from "@/components/site/MarkdownView";
import { extractToc } from "@/lib/markdown-utils";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.fetchQuery({
      queryKey: ["post", params.slug],
      queryFn: () => getPublishedPostBySlug({ data: { slug: params.slug } }),
    });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} — ${site.name}` : "Blog post";
    const desc = p?.excerpt ?? site.shortBio;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        ...(p?.cover_image ? [{ property: "og:image", content: p.cover_image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: p
        ? [{
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: p.title,
              description: p.excerpt ?? undefined,
              image: p.cover_image ?? undefined,
              datePublished: p.published_at ?? undefined,
              author: { "@type": "Person", name: site.name },
            }),
          }]
        : [],
    };
  },
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const fetchPost = useServerFn(getPublishedPostBySlug);
  const bump = useServerFn(incrementPostView);

  const { data: post } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost({ data: { slug } }),
  });

  useEffect(() => {
    const key = `viewed:${slug}`;
    if (typeof window === "undefined" || sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    bump({ data: { slug } }).catch(() => {});
  }, [slug, bump]);

  if (!post) return null;
  const toc = extractToc(post.content);

  return (
    <article className="pb-24">
      {/* Cover */}
      {post.cover_image && (
        <div className="relative h-[42vh] w-full overflow-hidden border-b border-border bg-muted">
          <img src={post.cover_image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
      )}

      <div className="container-wide pt-12">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-vermilion">
          <ArrowLeft className="h-3 w-3" /> Back to Blog
        </Link>

        <header className="mx-auto mt-8 max-w-3xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            {post.category && <span className="text-vermilion">{post.category}</span>}
            {post.published_at && <time dateTime={post.published_at}>{format(new Date(post.published_at), "MMMM d, yyyy")}</time>}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.reading_minutes} min read</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {post.view_count} views</span>
          </div>
        </header>

        <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-[1fr_220px]">
          <div className="prose-sumi min-w-0">
            <MarkdownView content={post.content} />

            {post.tags?.length > 0 && (
              <div className="mt-16 flex flex-wrap gap-1.5 border-t border-border pt-8">
                {post.tags.map((t: string) => (
                  <Link
                    key={t}
                    to="/blog"
                    className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-vermilion hover:text-vermilion"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermilion">Contents</div>
                <ul className="mt-4 space-y-2 border-l border-border">
                  {toc.map((h) => (
                    <li key={h.slug} style={{ paddingLeft: `${(h.depth - 2) * 12 + 12}px` }}>
                      <a href={`#${h.slug}`} className="block text-xs text-muted-foreground transition-colors hover:text-vermilion">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
