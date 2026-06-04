import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock, Eye, Share2 } from "lucide-react";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  reading_minutes: number;
  view_count: number;
  published_at: string | null;
}

export function PostCard({
  post,
  layout = "vertical",
}: {
  post: PostCardData;
  layout?: "vertical" | "horizontal";
}) {
  const isHorizontal = layout === "horizontal";

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={
        isHorizontal
          ? "group block rounded-3xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          : "group block"
      }
    >
      <article
        className={
          isHorizontal
            ? "grid gap-6 md:grid-cols-[280px_minmax(0,1fr)] items-stretch"
            : "grid gap-4"
        }
      >
        {post.cover_image && (
          <div
            className={
              isHorizontal
                ? "overflow-hidden rounded-[1.25rem] border border-border bg-muted md:h-full"
                : "aspect-[16/9] overflow-hidden rounded-md border border-border bg-muted"
            }
          >
            <img
              src={post.cover_image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className={isHorizontal ? "flex flex-col justify-between" : ""}>
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              {post.category && <span className="text-vermilion">{post.category}</span>}
              {post.published_at && (
                <time dateTime={post.published_at}>{format(new Date(post.published_at), "MMM d, yyyy")}</time>
              )}
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold leading-tight transition-colors group-hover:text-vermilion">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="rounded-full bg-vermilion px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-vermilion-foreground">
              Read More
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Share2 className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
