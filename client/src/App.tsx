import React from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSetAIConsent } from "@/components/setai-consent-modal";
import { RavensWhisper } from "@/components/ravens-whisper";
import { SetAIFooter } from "@/components/setai-footer";
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
import Transparency from "./pages/transparency";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Sanctuary Nodes", href: "/sanctuary-nodes" },
  { label: "Makers & Guilds", href: "/makers-guilds" },
  { label: "Products & Services", href: "/products-services" },
  { label: "Join", href: "/join" },
  { label: "Safety", href: "/safety-certification" },
  { label: "Blog", href: "/blog" },
] as const;

const FULL_NAV = [
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
  { label: "Transparency Log", href: "/transparency" },
] as const;

function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen flex-col wm-grain bg-background text-foreground">
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
                <span className="text-xl">🦅</span>
              </div>
              <div className="leading-tight">
                <div className="wm-hero-title text-base font-semibold">WitchMart</div>
                <div className="text-xs text-muted-foreground">Protected by SetAI</div>
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
                Enter Sanctuary
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
                    {FULL_NAV.map((item) => {
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

      <main id="main" className="mx-auto max-w-6xl flex-1 px-4 py-10" tabIndex={-1}>
        {children}
      </main>

      <SetAIFooter />
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
      <Route path="/transparency" component={Transparency} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { ConsentModal, consentGiven } = useSetAIConsent();

  return (
    <>
      {ConsentModal}
      <SiteShell>
        <Router />
      </SiteShell>
      {consentGiven && <RavensWhisper />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
