import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, FileText, PlusCircle } from "lucide-react";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: `Studio — ${site.name}` }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { nav({ to: "/login" }); return; }
      setReady(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav({ to: "/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  if (!ready) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  const signOut = async () => { await supabase.auth.signOut(); nav({ to: "/login" }); };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border md:flex md:flex-col">
        <div className="border-b border-border px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-sm bg-vermilion text-vermilion-foreground font-display font-bold text-sm">{site.name.charAt(0)}</span>
            <span className="font-display text-sm font-semibold">Studio</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link to="/admin" activeOptions={{ exact: true }} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground">
            <FileText className="h-4 w-4" /> Posts
          </Link>
          <Link to="/admin/new" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground">
            <PlusCircle className="h-4 w-4" /> New essay
          </Link>
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border px-4 py-3 flex items-center justify-between">
          <span className="font-display font-semibold">Studio</span>
          <div className="flex gap-2">
            <Link to="/admin" className="text-xs">Posts</Link>
            <Link to="/admin/new" className="text-xs">New</Link>
            <button onClick={signOut} className="text-xs">Out</button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
