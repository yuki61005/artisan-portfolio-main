import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPostByIdAdmin } from "@/lib/posts.functions";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/edit/$id")({ component: EditPost });

function EditPost() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const fetchOne = useServerFn(getPostByIdAdmin);
  const { data: post, isLoading } = useQuery({
    queryKey: ["admin", "post", id],
    queryFn: () => fetchOne({ data: { id } }),
  });
  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (!post) return <div className="p-8 text-sm text-muted-foreground">Not found.</div>;
  return <PostEditor initial={post} onSaved={() => nav({ to: "/admin" })} />;
}
