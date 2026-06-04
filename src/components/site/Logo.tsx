import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site-config";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={className ?? "relative block h-8 w-8 overflow-hidden rounded-sm"}>
      <img
        src="/light_logo.svg"
        alt={`${site.name} logo light`}
        className="h-full w-full object-contain dark:hidden"
      />
      <img
        src="/black_logo.svg"
        alt={`${site.name} logo dark`}
        className="hidden h-full w-full object-contain dark:block"
      />
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link to="/" className={className ?? "inline-flex items-center gap-2"}>
      <LogoMark />
      <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
        {site.name}
      </span>
    </Link>
  );
}
