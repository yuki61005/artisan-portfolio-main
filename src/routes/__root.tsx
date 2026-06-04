import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-vermilion">404 · 迷子</div>
        <h1 className="mt-3 font-display text-5xl font-bold">Lost in the inkpot.</h1>
        <p className="mt-3 text-muted-foreground">This page doesn't exist — or hasn't been written yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">Something cracked the surface.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.title },
      { name: "description", content: site.shortBio },
      { name: "author", content: site.name },
      { property: "og:site_name", content: site.name },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.title },
      { property: "og:description", content: site.shortBio },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a0a0a" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        children: `(() => { try { const t = localStorage.getItem('theme'); const d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches); document.documentElement.classList.toggle('dark', d); } catch(e){} })();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grain">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = path.startsWith("/admin") || path === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgress />
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "pt-16"}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster />
    </QueryClientProvider>
  );
}
