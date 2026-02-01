import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-how-title">
          How It Works
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-how-subtitle">
          Placeholder explainer for sanctuary nodes, membership types, and distributed cooperative governance.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold" data-testid="text-how-nodes-title">
            What are Sanctuary Nodes?
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-how-nodes-body">
            Nodes are local community hubs—part sanctuary, part marketplace access point, part skills-and-care network.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-how-join-title">
            Join or Start a Node
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-how-join-body">
            Placeholder: step-by-step onboarding and minimum safety/hosting requirements.
          </p>
          <Link
            href="/join"
            className="wm-focus-ring mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
            data-testid="button-how-cta-join"
          >
            Go to Join
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-how-membership-title">
          Membership Types (placeholder)
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {["Community", "Maker", "Guild", "Node Owner"].map((t) => (
            <div key={t} className="rounded-xl border bg-background/60 p-4" data-testid={`card-membership-${t.replaceAll(" ", "_")}`}>
              <div className="text-sm font-semibold" data-testid={`text-membership-title-${t.replaceAll(" ", "_")}`}>
                {t}
              </div>
              <p className="mt-1 text-xs text-muted-foreground" data-testid={`text-membership-body-${t.replaceAll(" ", "_")}`}>
                Placeholder: benefits, expectations, and how votes/decisions work.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-how-governance-title">
          Governance (distributed)
        </div>
        <p className="mt-2 text-sm text-muted-foreground" data-testid="text-how-governance-body">
          Placeholder: cooperative decision-making, transparency practices, and dispute resolution pathways.
        </p>
      </section>
    </div>
  );
}
