import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/new")({ component: NewPost });

function NewPost() {
  const nav = useNavigate();
  return <PostEditor onSaved={() => nav({ to: "/admin" })} />;
}
