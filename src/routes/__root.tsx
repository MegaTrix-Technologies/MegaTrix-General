import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Preloader from "@/components/Preloader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root Error Boundary caught:", error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        {error?.message && (
          <p className="mt-3 text-[11px] font-mono text-red-400 bg-red-950/30 border border-red-500/30 p-2 text-left break-all max-h-32 overflow-y-auto">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MegaTrix" },
      { name: "description", content: "Megatrix delivers high-performance full-stack applications, secure cloud infrastructure, and custom AI pipelines." },
      { name: "author", content: "Megatrix" },
      { property: "og:title", content: "MegaTrix" },
      { property: "og:description", content: "Building next-gen digital systems & platforms." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/favicon.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/favicon.svg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@700;900&family=Silkscreen:wght@400;700&family=Share+Tech+Mono&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Anti-flash script: reads theme preference BEFORE React hydrates to avoid white flash
const THEME_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('mt_theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (!saved) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('mt_theme', 'light');
      }
    }
  } catch(e) {}
})();
`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Anti-flash: apply theme before CSS/JS loads */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showPreloader, setShowPreloader] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!sessionStorage.getItem("mt_preloader_seen")) {
      setShowPreloader(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("mt_preloader_seen", "true");
    setShowPreloader(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {mounted && showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} duration={1200} />
      )}
      <div className={mounted && showPreloader ? "invisible h-0 overflow-hidden" : "visible"}>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
