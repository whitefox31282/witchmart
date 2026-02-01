import React from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/home";
import About from "./pages/about";
import HowItWorks from "./pages/how-it-works";
import SanctuaryNodes from "./pages/sanctuary-nodes";
import MakersGuilds from "./pages/makers-guilds";
import ProductsServices from "./pages/products-services";
import PricingTransparency from "./pages/pricing-transparency";
import SafetyCertification from "./pages/safety-certification";
import Resources from "./pages/resources";
import Join from "./pages/join";
import Blog from "./pages/blog";
import ContactSupport from "./pages/contact-support";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About WitchMart", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Sanctuary Nodes", href: "/sanctuary-nodes" },
  { label: "Makers & Guilds", href: "/makers-guilds" },
  { label: "Products & Services", href: "/products-services" },
  { label: "Pricing & Transparency", href: "/pricing-transparency" },
  { label: "Safety & Certification", href: "/safety-certification" },
  { label: "Resources", href: "/resources" },
  { label: "Join / Get Involved", href: "/join" },
  { label: "Blog / Updates", href: "/blog" },
  { label: "Contact / Support", href: "/contact" },
] as const;

function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen wm-grain bg-background text-foreground">
      <a
        href="#main"
        className="wm-focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-card px-4 py-2 shadow-lg"
        data-testid="link-skip-to-content"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              href="/"
              className="wm-focus-ring flex items-center gap-3 rounded-md px-2 py-1"
              data-testid="link-home"
            >
              <div
                className="grid size-9 place-items-center rounded-xl border bg-card shadow-sm"
                aria-hidden="true"
              >
                <span className="wm-hero-title text-sm font-semibold">WM</span>
              </div>
              <div className="leading-tight">
                <div className="wm-hero-title text-base font-semibold">WitchMart</div>
                <div className="text-xs text-muted-foreground">Member-owned cooperative</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
              {NAV.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "wm-focus-ring rounded-full px-3 py-2 text-sm transition hover:bg-muted/60" +
                      (active ? " bg-muted/80" : "")
                    }
                    data-testid={`link-nav-${item.href.replaceAll("/", "").replaceAll("-", "_") || "home"}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/join"
                className="wm-focus-ring hidden sm:inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:opacity-90"
                data-testid="button-join-header"
              >
                Join
              </Link>

              <details className="lg:hidden relative">
                <summary
                  className="wm-focus-ring list-none rounded-full border bg-card px-3 py-2 text-sm shadow-sm hover:bg-muted/50"
                  data-testid="button-open-menu"
                >
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-[min(92vw,420px)] overflow-hidden rounded-2xl border bg-card shadow-lg">
                  <div className="p-2">
                    {NAV.map((item) => {
                      const active = location === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={
                            "wm-focus-ring block rounded-xl px-3 py-2 text-sm hover:bg-muted/60" +
                            (active ? " bg-muted/80" : "")
                          }
                          data-testid={`link-mobile-${item.href.replaceAll("/", "").replaceAll("-", "_") || "home"}`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-10" tabIndex={-1}>
        {children}
      </main>

      <footer className="border-t bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <div className="wm-hero-title text-lg font-semibold" data-testid="text-footer-title">
                WitchMart
              </div>
              <p className="mt-2 text-sm text-muted-foreground" data-testid="text-footer-mission">
                A member-owned, Pagan-aligned cooperative marketplace and sanctuary network.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold" data-testid="text-footer-disclaimer-title">
                Safety & Legal
              </div>
              <p className="mt-2 text-sm text-muted-foreground" data-testid="text-footer-disclaimer">
                This prototype is for community information and onboarding. It is not legal advice, medical advice, or a substitute
                for local regulations. Follow published safety guidance and coordinate responsibly.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold" data-testid="text-footer-transparency-title">
                Transparency
              </div>
              <p className="mt-2 text-sm text-muted-foreground" data-testid="text-footer-transparency">
                We publish clear pricing rules, community standards, and public-facing reports. Member ownership means member
                oversight.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground">
            <div data-testid="text-footer-copyright">© {new Date().getFullYear()} WitchMart (prototype)</div>
            <div data-testid="text-footer-note">
              Built for accessibility: keyboard-friendly navigation, strong contrast, and clear hierarchy.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/sanctuary-nodes" component={SanctuaryNodes} />
      <Route path="/makers-guilds" component={MakersGuilds} />
      <Route path="/products-services" component={ProductsServices} />
      <Route path="/pricing-transparency" component={PricingTransparency} />
      <Route path="/safety-certification" component={SafetyCertification} />
      <Route path="/resources" component={Resources} />
      <Route path="/join" component={Join} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={ContactSupport} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SiteShell>
          <Router />
        </SiteShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
