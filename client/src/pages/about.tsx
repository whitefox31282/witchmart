export default function About() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-about-title">
          About WitchMart
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-about-subtitle">
          Placeholder copy: origins, manifesto, governance, and the people behind the cooperative.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold" data-testid="text-about-origins-title">
            Origins
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-about-origins-body">
            Placeholder: founder story, the why behind WitchMart, and how the cooperative vision formed. (You referenced “Sam
            Walton’s vision” and a founder narrative—this section will be finalized with your preferred framing.)
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-about-founder-title">
            Meet the Founder
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-about-founder-body">
            Placeholder: Jonathan Bradley — role, mission, and cooperative leadership structure.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-about-manifesto-title">
          Manifesto
        </div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {[
            "Transparency first: visible rules, visible flows, visible decisions.",
            "Cooperation over extraction.",
            "Accessibility and dignity for all members.",
            "Resilience through local nodes and shared skills.",
            "Safety culture and clear boundaries.",
            "Member ownership means member oversight.",
          ].map((line, idx) => (
            <li
              key={idx}
              className="rounded-xl border bg-background/60 p-4 text-sm"
              data-testid={`text-about-manifesto-${idx}`}
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-about-timeline-title">
          Timeline / Vision
        </div>
        <p className="mt-2 text-sm text-muted-foreground" data-testid="text-about-timeline-body">
          Placeholder: a phased roadmap for sanctuary economics—pilot nodes, guild formation, cooperative governance, and public
          reporting.
        </p>
      </section>
    </div>
  );
}
