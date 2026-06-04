import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: `Sign in — ${site.name}` }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        nav({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-mono text-xs uppercase tracking-[0.3em] text-vermilion">← {site.name}</Link>
        <h1 className="mt-6 text-center font-display text-3xl font-bold">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Access the writing studio." : "First account becomes admin."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-vermilion" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-vermilion" />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 block w-full text-center text-xs text-muted-foreground hover:text-vermilion">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
