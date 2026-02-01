import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";

type Maker = {
  id: string;
  name: string;
  category: string;
  reputation: number;
  location: string;
  tagline: string;
};

const MOCK_MAKERS: Maker[] = [
  {
    id: "mk-101",
    name: "Iron & Ivy Workshop",
    category: "repair / tools",
    reputation: 4.8,
    location: "Madison, WI",
    tagline: "Fix-first craft: restore, sharpen, mend.",
  },
  {
    id: "mk-102",
    name: "Hearthseed Guild",
    category: "ag / food",
    reputation: 4.6,
    location: "Asheville, NC",
    tagline: "Seasonal staples, shared skills, soil wisdom.",
  },
  {
    id: "mk-103",
    name: "Lanternglass Atelier",
    category: "handmade goods",
    reputation: 4.9,
    location: "Portland, ME",
    tagline: "Small-batch goods, honest materials.",
  },
];

export default function MakersGuilds() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_MAKERS;
    return MOCK_MAKERS.filter((m) =>
      [m.name, m.category, m.location, m.tagline].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-makers-title">
          Makers & Guilds
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-makers-subtitle">
          Directory mock: filter by craft category and reputation. Profiles, photos, and reviews can be expanded next.
        </p>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search makers (name, category, location)…"
              className="wm-focus-ring w-full rounded-xl border bg-background px-10 py-2.5 text-sm shadow-sm"
              data-testid="input-maker-search"
            />
          </div>
          <div className="text-xs text-muted-foreground" data-testid="text-makers-count">
            Showing {filtered.length} profile{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <article key={m.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-maker-${m.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-maker-name-${m.id}`}>
                    {m.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-maker-category-${m.id}`}>
                    {m.category} • {m.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs" data-testid={`badge-maker-reputation-${m.id}`}>
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  {m.reputation.toFixed(1)}
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-maker-tagline-${m.id}`}>
                {m.tagline}
              </p>

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-maker-reviews-${m.id}`}>
                Reviews placeholder: community feedback, safety notes, and fulfillment reliability.
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
