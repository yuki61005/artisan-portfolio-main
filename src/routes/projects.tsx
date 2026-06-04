import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/site-config";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Aoi Tanaka" },
      { name: "description", content: "Selected engineering work, tools, and experiments." },
      { property: "og:title", content: "Projects — Aoi Tanaka" },
      { property: "og:description", content: "Selected engineering work, tools, and experiments." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

const categories = ["All", "Web", "Tool", "Library", "Experiment"] as const;

function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <div className="container-wide py-24">
      <header className="max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">Projects</div>
        <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
          Things I've built.
        </h1>
        <p className="mt-5 text-muted-foreground">
          A working archive — products, tools, and the occasional experiment.
        </p>
      </header>

      <div className="mt-12 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
              filter === c
                ? "border-vermilion bg-vermilion text-vermilion-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
        {visible.map((p) => (
          <article key={p.title} className="group relative bg-background p-8 transition-colors hover:bg-muted/40">
            <div className="flex items-start justify-between">
              <div className="font-mono text-xs uppercase tracking-widest text-vermilion">
                {p.category} · {p.year}
              </div>
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-8 w-8 place-items-center rounded text-muted-foreground hover:text-foreground">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" aria-label="Live" className="grid h-8 w-8 place-items-center rounded text-muted-foreground hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">{p.title}</h2>
            <p className="mt-3 max-w-prose text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
