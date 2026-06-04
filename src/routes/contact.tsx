import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Send, Github, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${site.name}` },
      { name: "description", content: `Get in touch with ${site.name}.` },
      { property: "og:title", content: `Contact — ${site.name}` },
      { property: "og:description", content: `Get in touch with ${site.name}.` },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    const subject = encodeURIComponent(`Hello from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
  };

  return (
    <div className="container-wide py-24">
      <div className="grid gap-16 md:grid-cols-12">
        <header className="md:col-span-5">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">Contact</div>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            Say hello.
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Working on something interesting? Have a question about an essay? I read every message and reply within a couple of days.
          </p>

          <dl className="mt-12 space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-vermilion" />
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Email</dt>
                <dd className="mt-1 font-mono text-sm"><a href={`mailto:${site.email}`} className="hover:text-vermilion">{site.email}</a></dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-vermilion" />
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Based in</dt>
                <dd className="mt-1 font-mono text-sm">{site.location}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-10 flex gap-2">
            <a href={site.social.github} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion"><Github className="h-4 w-4" /></a>
            <a href={site.social.twitter} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion"><Twitter className="h-4 w-4" /></a>
            <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion"><Linkedin className="h-4 w-4" /></a>
          </div>
        </header>

        <form onSubmit={onSubmit} className="md:col-span-6 md:col-start-7 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-vermilion"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-vermilion"
              placeholder="you@domain.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-vermilion"
              placeholder="Tell me about your project…"
            />
          </div>
          <button
            type="submit"
            className="group inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Send message <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
