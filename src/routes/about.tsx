import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { site, skillMatrix, experience, education } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${site.name}` },
      { name: "description", content: `About ${site.name}: ${site.shortBio}` },
      { property: "og:title", content: `About — ${site.name}` },
      { property: "og:description", content: site.shortBio },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const levelDots = { Basic: 1, Intermediate: 2, Advanced: 3 } as const;

function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="blob blob-mint" />
          <span className="blob blob-lav" />
        </div>

        <div className="container-wide relative z-10 grid grid-cols-12 gap-8 py-24 md:py-32">
          <header className="col-span-12 md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
              About · 自己紹介
            </div>
            <h1
              className="mt-4 font-display font-bold tracking-tight"
              style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              Hi, I'm {site.name.split(" ")[0]}.<br />
              <span className="text-vermilion">Junior Web Developer</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-foreground/80">
              {site.longBio}
            </p>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-vermilion" /> {site.location}</li>
              <li className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-vermilion" /> <a href={`mailto:${site.email}`} className="hover:text-foreground">{site.email}</a></li>
              <li className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-vermilion" /> {site.phone}</li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={site.resumeUrl}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
              <a href={site.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium hover:border-foreground hover:text-vermilion">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium hover:border-foreground hover:text-vermilion">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </header>

          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur-sm">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">At a glance</div>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="mt-1 font-medium">Junior Web Developer</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="mt-1 font-medium">Frontend · Full-stack JavaScript</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Languages</dt>
                  <dd className="mt-1 font-medium">{site.languages}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Available for</dt>
                  <dd className="mt-1 font-medium">Junior dev roles, internships, freelance</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* SKILLS MATRIX */}
      <section className="border-b border-border">
        <div className="container-wide py-20">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">01 — Skills</div>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">What I work with</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Honest proficiency levels — what I ship today, and what I'm actively levelling up.
              </p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <div className="space-y-10">
                {skillMatrix.map((cat) => (
                  <div key={cat.category}>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{cat.category}</div>
                    <ul className="mt-4 divide-y divide-border border-y border-border">
                      {cat.items.map((s) => (
                        <li key={s.name} className="grid grid-cols-12 items-center gap-3 py-3">
                          <div className="col-span-7 md:col-span-5">
                            <div className="font-display text-base font-semibold">{s.name}</div>
                          </div>
                          <div className="col-span-5 md:col-span-4 text-xs text-muted-foreground">
                            {s.note}
                          </div>
                          <div className="col-span-12 md:col-span-3 flex items-center gap-2 md:justify-end">
                            <div className="flex gap-1">
                              {[1, 2, 3].map((d) => (
                                <span
                                  key={d}
                                  className={`h-1.5 w-6 rounded-full ${
                                    d <= levelDots[s.level] ? "bg-vermilion" : "bg-border"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                              {s.level}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="border-b border-border bg-muted/30">
        <div className="container-wide py-20">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">02 — Experience</div>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Path so far</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                From industrial chemistry to Japanese fluency to shipping web apps in Tokyo.
              </p>
            </div>
            <ol className="md:col-span-8 md:col-start-5 space-y-6">
              {experience.map((e) => (
                <li key={e.role + e.org} className="grid grid-cols-12 gap-4 rounded-xl border border-border bg-background p-6">
                  <div className="col-span-12 font-mono text-xs uppercase tracking-widest text-vermilion md:col-span-3">
                    {e.period}
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="font-display text-lg font-semibold">{e.role}</div>
                    <div className="text-sm text-muted-foreground">{e.org}</div>
                    <p className="mt-2 text-sm text-foreground/80">{e.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="border-b border-border">
        <div className="container-wide py-20">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">03 — Education</div>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Learning</h2>
            </div>
            <ul className="md:col-span-8 md:col-start-5 space-y-4">
              {education.map((e) => (
                <li key={e.school} className="grid grid-cols-12 gap-4 border-t border-border pt-4">
                  <div className="col-span-12 font-mono text-xs uppercase tracking-widest text-muted-foreground md:col-span-3">
                    {e.period}
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="font-display text-lg font-semibold">{e.degree}</div>
                    <div className="text-sm text-muted-foreground">{e.school} · {e.location}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container-wide grid items-center gap-8 py-16 md:grid-cols-2">
          <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
            Looking for a junior developer?<br />
            <span className="text-vermilion">Let's build something.</span>
          </h2>
          <div className="md:justify-self-end">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-vermilion hover:text-vermilion-foreground transition-colors">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
