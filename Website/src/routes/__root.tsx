import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-platform";
import { Moon, Sun } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-gradient-amber">404</h1>
        <h2 className="mt-4 text-xl font-display font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">That lesson or page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md gradient-amber px-4 py-2 text-sm font-medium text-accent-foreground">
          Back to platform
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing or return home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
          <Button variant="outline" asChild><a href="/">Go home</a></Button>
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
      { title: "FAST DSA — Deep Data Structures & Algorithms Learning Platform" },
      { name: "description", content: "Interactive FAST-NUCES Data Structures & Algorithms course with deep theory, code, visualizations, and university-level practice problems." },
      { property: "og:title", content: "FAST DSA Learning Platform" },
      { property: "og:description", content: "Master DSA the way FAST University teaches it — with rigor, intuition, and challenging problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center gap-3 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur z-20">
              <SidebarTrigger />
              <Link to="/" className="font-display font-semibold text-sm tracking-tight">
                FAST <span className="text-gradient-amber">DSA</span>
              </Link>
              <div className="ml-auto flex items-center gap-1">
                <Link to="/syllabus" className="text-xs px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Syllabus</Link>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
