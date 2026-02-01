const kits = [
  { id: "rk-1", title: "Node Startup Kit (placeholder)", desc: "Checklist, roles, safety, and first 30 days." },
  { id: "rk-2", title: "Guild Starter Kit (placeholder)", desc: "How to form a guild, set standards, and handle reviews." },
  { id: "rk-3", title: "Legal Templates (placeholder)", desc: "Agreements, waivers, and cooperative policies." },
  { id: "rk-4", title: "FAQs & How-Tos (placeholder)", desc: "Print-friendly guides and onboarding answers." },
];

export default function Resources() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-resources-title">
          Resources
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-resources-subtitle">
          Startup kits, templates, FAQs, and guides. Everything should be printable and accessible.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {kits.map((k) => (
          <article key={k.id} className="rounded-2xl border bg-card p-6 shadow-sm" data-testid={`card-resource-${k.id}`}>
            <div className="text-sm font-semibold" data-testid={`text-resource-title-${k.id}`}>
              {k.title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground" data-testid={`text-resource-desc-${k.id}`}>
              {k.desc}
            </p>
            <button
              className="wm-focus-ring mt-4 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-sm hover:bg-muted/60"
              data-testid={`button-resource-open-${k.id}`}
              onClick={() => alert("Placeholder: open resource detail view.")}
            >
              Open
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
