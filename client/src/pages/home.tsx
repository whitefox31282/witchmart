import { Link } from "wouter";
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { HOTSPOTS } from "../lib/hotspots";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="wm-hero-bg overflow-hidden rounded-3xl border bg-card shadow-lg">
        <div className="relative h-[600px] sm:h-[800px]">
          <img
            src="/assets/village/background.png"
            alt="Village background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {HOTSPOTS.map(({ id, label, route, x, y, width, height }) => (
            <Link
              key={id}
              href={route}
              aria-label={label}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && (window.location.href = route)}
              style={{
                position: "absolute",
                left: x * 100 + "%",
                top: y * 100 + "%",
                width: width * 100 + "%",
                height: height * 100 + "%",
              }}
            />
          ))}
        </div>

        <div className="px-6 py-12 sm:px-10 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span data-testid="text-pill-member-owned">Member-owned</span>
            </Pill>
            <Pill>
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span data-testid="text-pill-safety-first">Safety-first</span>
            </Pill>
            <Pill>
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span data-testid="text-pill-local-nodes">Local sanctuary nodes</span>
            </Pill>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div
                className="wm-hero-title text-4xl font-semibold leading-tight sm:text-5xl"
                data-testid="text-home-title"
              >
                WitchMart
              </div>
              <p
                className="mt-4 max-w-2xl text-lg text-foreground/90"
                data-testid="text-home-tagline"
              >
                A People‑Powered, Pagan‑Aligned Cooperative Economy
              </p>

              <p className="mt-6 max-w-2xl text-sm text-muted-foreground" data-testid="text-home-intro">
                WitchMart is a community cooperative marketplace and sanctuary network—built for transparency, resilience, and
                mutual care. This is a front-end prototype with placeholder content that can be refined collaboratively.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sanctuary-nodes"
                  className="wm-focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 active:opacity-90"
                  data-testid="button-find-node"
                >
                  Find a Node
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/join"
                  className="wm-focus-ring inline-flex items-center justify-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-sm hover:bg-muted/60"
                  data-testid="button-join-home"
                >
                  Join
                </Link>
                <Link
                  href="/about"
                  className="wm-focus-ring inline-flex items-center justify-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-sm hover:bg-muted/60"
                  data-testid="button-our-story"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-card/70 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-semibold" data-testid="text-home-upfront-title">
                Mission + Transparency, up front
              </div>
              <p className="mt-2 text-sm text-muted-foreground" data-testid="text-home-upfront-body">
                We publish clear rules, member oversight, and community safety standards. Pricing is designed to sustain the network
                without exploitation.
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border bg-background/60 p-3">
                  <div className="text-xs font-semibold" data-testid="text-home-disclaimer-label">
                    Safety & Legal Disclaimer
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground" data-testid="text-home-disclaimer">
                    Prototype content only. Follow local laws and published safety guidance. Nothing here is legal or medical advice.
                  </p>
                </div>

                <div className="rounded-xl border bg-background/60 p-3">
                  <div className="text-xs font-semibold" data-testid="text-home-ecosystem-label">
                    Cooperative Network
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground" data-testid="text-home-ecosystem">
                    Member-owned • Community-governed • Transparency-first
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-home-card-1-title">
            Sanctuary Nodes
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-home-card-1-body">
            Local, welcoming points of contact: events, mutual aid, marketplace pickup, and community care.
          </p>
          <Link
            href="/sanctuary-nodes"
            className="wm-focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            data-testid="link-home-card-1"
          >
            Browse nodes <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-home-card-2-title">
            Makers & Guilds
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-home-card-2-body">
            Profiles, craft categories, reputation, and reviews—designed for human trust rather than corporate metrics.
          </p>
          <Link
            href="/makers-guilds"
            className="wm-focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            data-testid="link-home-card-2"
          >
            Meet makers <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-home-card-3-title">
            Pricing & Transparency
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-home-card-3-body">
            Where your dollar goes, how funds are governed, and how we keep the system accessible.
          </p>
          <Link
            href="/pricing-transparency"
            className="wm-focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            data-testid="link-home-card-3"
          >
            See the model <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
