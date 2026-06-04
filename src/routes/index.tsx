import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { site, skills, projects } from "@/lib/site-config";
import { listPublishedPosts } from "@/lib/posts.functions";
import { PostCard } from "@/components/site/PostCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: site.title },
      { name: "description", content: site.shortBio },
      { property: "og:title", content: site.title },
      { property: "og:description", content: site.shortBio },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data: posts = [] } = useQuery({
    queryKey: ["posts", "home"],
    queryFn: () => fetchPosts({ data: undefined }),
  });

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const latest = posts.slice(0, 3);

  return (
    <>
      {/* HERO — evolved from original hkk identity */}
      <section className="relative overflow-hidden">
        {/* Signature floating blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="blob blob-mint" />
          <span className="blob blob-lav" />
          <span className="blob blob-golden" />
        </div>
        <span
          aria-hidden
          className="star-mark"
          style={{ fontSize: "clamp(6rem, 18vw, 18rem)", bottom: "10%", right: "8%", lineHeight: 1 }}
        >
          ★
        </span>

        <div className="container-wide relative z-10 grid min-h-[92vh] grid-cols-12 items-center gap-8 py-24">
          <div className="col-span-12 md:col-span-10">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion anim-fade">
              · {site.location} · available for select work
            </div>
            <h1 className="mt-6 font-display font-bold tracking-tight anim-fade-up"
                style={{ fontSize: "clamp(3.8rem, 12vw, 11rem)", lineHeight: 0.88, letterSpacing: "-0.04em" }}>
              My<br />awesome<br />portfolio
            </h1>
            <p className="mt-8 font-display font-medium anim-fade-up"
               style={{ fontSize: "clamp(1.4rem, 4vw, 2.6rem)", maxWidth: "20ch" }}>
              Developer · Writer · Image making
            </p>
            <p className="mt-6 max-w-[44ch] text-lg text-foreground/75 anim-fade-up">
              {site.longBio}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 anim-fade-up">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                View work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={site.resumeUrl}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:border-foreground hover:text-vermilion"
              >
                <Download className="h-4 w-4" /> Résumé
              </a>
              <div className="ml-2 flex items-center gap-1">
                <a href={site.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full text-foreground/60 hover:text-foreground"><Github className="h-4 w-4" /></a>
                <a href={site.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="grid h-10 w-10 place-items-center rounded-full text-foreground/60 hover:text-foreground"><Twitter className="h-4 w-4" /></a>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full text-foreground/60 hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* TECH STACK */}
      <section className="border-y border-border bg-muted/30">
        <div className="container-wide py-16">
          <SectionLabel index="01" title="Toolkit" />
          <div className="mt-10 grid gap-10 md:grid-cols-4">
            {skills.map((g) => (
              <div key={g.group}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{g.group}</div>
                <ul className="mt-3 space-y-1.5">
                  {g.items.map((s) => (
                    <li key={s} className="font-mono text-sm">{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section>
        <div className="container-wide py-24">
          <div className="flex items-end justify-between gap-6">
            <SectionLabel index="02" title="Selected work" />
            <Link to="/projects" className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-vermilion">
              All projects <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {featured.map((p) => (
              <article key={p.title} className="group bg-background p-8 transition-colors hover:bg-muted/40">
                <div className="flex items-start justify-between">
                  <div className="font-mono text-xs uppercase tracking-widest text-vermilion">{p.category} · {p.year}</div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-vermilion" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t) => (
                    <span key={t} className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="border-t border-border">
        <div className="container-wide py-24">
          <div className="flex items-end justify-between gap-6">
            <SectionLabel index="03" title="From the blog" />
            <Link to="/blog" className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-vermilion">
              All blog posts <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          {latest.length === 0 ? (
            <div className="mt-12 rounded-md border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No posts yet. Sign in and write the first one at <code className="font-mono">/admin</code>.
            </div>
          ) : (
            <div className="mt-12 grid gap-12 md:grid-cols-3">
              {latest.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="container-wide grid items-center gap-8 py-20 md:grid-cols-2">
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Have a project in mind?<br />
            <span className="text-vermilion">Let's talk.</span>
          </h2>
          <div className="md:justify-self-end">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-vermilion hover:text-vermilion-foreground transition-colors">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">{index}</div>
      <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h2>
    </div>
  );
}
