import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit3, Trash2, PlusCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { listAllPostsAdmin, deletePost } from "@/lib/posts.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const fetchAll = useServerFn(listAllPostsAdmin);
  const del = useServerFn(deletePost);
  const qc = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => fetchAll({ data: undefined }),
  });

  const m = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "posts"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-8 max-w-5xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">Studio</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Posts</h1>
        </div>
        <Link to="/admin/new" className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
          <PlusCircle className="h-4 w-4" /> New essay
        </Link>
      </header>

      <div className="mt-8 rounded-md border border-border">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No posts yet. Write your first essay.</div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.published ? "bg-vermilion" : "bg-muted-foreground"}`} />
                    <span className="font-display font-semibold truncate">{p.title}</span>
                    {p.category && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.category}</span>}
                  </div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    /{p.slug} · {p.published ? `published ${p.published_at ? format(new Date(p.published_at), "MMM d, yyyy") : ""}` : "draft"} · {p.view_count} views
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {p.published && (
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground" aria-label="View">
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link to="/admin/edit/$id" params={{ id: p.id }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground" aria-label="Edit">
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) m.mutate(p.id); }}
                    className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-destructive" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
