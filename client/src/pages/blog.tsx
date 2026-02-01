const posts = [
  {
    id: "bl-1",
    title: "Welcome to WitchMart (prototype)",
    date: "2026-02-01",
    excerpt: "What we are building, why it matters, and how members shape the system.",
  },
  {
    id: "bl-2",
    title: "Sanctuary nodes: the first 90 days (placeholder)",
    date: "2026-02-01",
    excerpt: "A practical onboarding rhythm: safety, roles, inventory, and trust-building.",
  },
];

export default function Blog() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-blog-title">
          Blog / Updates
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-blog-subtitle">
          News, maker/guild features, event highlights, and updates. (Simple list for now.)
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="rounded-2xl border bg-card p-6 shadow-sm" data-testid={`card-post-${p.id}`}>
            <div className="text-sm font-semibold" data-testid={`text-post-title-${p.id}`}>
              {p.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-post-date-${p.id}`}>
              {p.date}
            </div>
            <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-post-excerpt-${p.id}`}>
              {p.excerpt}
            </p>
            <button
              className="wm-focus-ring mt-4 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-sm hover:bg-muted/60"
              data-testid={`button-post-read-${p.id}`}
              onClick={() => alert("Placeholder: open post detail.")}
            >
              Read
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
