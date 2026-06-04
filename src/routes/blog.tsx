import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listPublishedPosts, listAllTags } from "@/lib/posts.functions";
import { PostCard } from "@/components/site/PostCard";

const PAGE_SIZE = 8;

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Aoi Tanaka" },
      { name: "description", content: "Essays on engineering craft, systems thinking, and shipping software." },
      { property: "og:title", content: "Blog — Aoi Tanaka" },
      { property: "og:description", content: "Essays on engineering craft, systems thinking, and shipping software." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchPosts = useServerFn(listPublishedPosts);
  const fetchTags = useServerFn(listAllTags);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", activeCategory],
    queryFn: () => fetchPosts({ data: { category: activeCategory || undefined } }),
  });
  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags({ data: undefined }),
  });

  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const visible = useMemo(
    () => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [posts, page],
  );

  return (
    <div className="container-wide py-24">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">Blog</div>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            A collection of ideas and stories.
          </h1>
          <p className="mt-5 text-muted-foreground">
            Explore blog posts, project notes, and writing on engineering, design, and product craft.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">All Categories</span>
          <div className="rounded-full border border-border bg-background px-4 py-2.5">
            <select
              value={activeCategory ?? ""}
              onChange={(e) => {
                setActiveCategory(e.target.value || null);
                setPage(1);
              }}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">All categories</option>
              {tagData?.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} layout="horizontal" />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="mt-16 rounded-md border border-dashed border-border p-16 text-center">
          <p className="text-sm text-muted-foreground">No posts yet. Sign in and write the first one at <code className="font-mono">/admin</code>.</p>
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-9 w-9 rounded-md border text-sm font-mono ${
                page === n ? "border-vermilion bg-vermilion text-vermilion-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
