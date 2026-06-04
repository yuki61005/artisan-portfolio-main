import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { LogoMark } from "./Logo";
import { site } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="container-wide py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-sm font-semibold">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{site.shortBio}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Pages</div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <li><Link to="/" className="hover:text-vermilion">Home</Link></li>
              <li><Link to="/about" className="hover:text-vermilion">About</Link></li>
              <li><Link to="/projects" className="hover:text-vermilion">Projects</Link></li>
              <li><Link to="/blog" className="hover:text-vermilion">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-vermilion">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Elsewhere</div>
            <div className="mt-4 flex gap-2">
              <a href={site.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href={site.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email" className="grid h-9 w-9 place-items-center rounded-md border border-border hover:border-vermilion hover:text-vermilion transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {site.name}. Crafted with care in {site.location}.</div>
          <div className="font-mono">墨 · sumi ink</div>
        </div>
      </div>
    </footer>
  );
}
