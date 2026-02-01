import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import type { Maker } from "@shared/schema";

export default function MakersGuilds() {
  const [query, setQuery] = useState("");

  const { data: makers = [], isLoading, error } = useQuery<Maker[]>({
    queryKey: ["/api/makers", query],
    queryFn: async () => {
      const url = query ? `/api/makers?q=${encodeURIComponent(query)}` : "/api/makers";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch makers");
      return response.json();
    },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-makers-title">
          Makers & Guilds
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-makers-subtitle">
          Directory with craft categories and reputation. Profiles, photos, and reviews can be expanded next.
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
            {isLoading ? "Loading..." : `Showing ${makers.length} profile${makers.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" data-testid="error-makers">
            Failed to load makers. Please try again.
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {makers.map((m) => (
            <article key={m.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-maker-${m.makerId}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-maker-name-${m.makerId}`}>
                    {m.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-maker-category-${m.makerId}`}>
                    {m.category} • {m.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs" data-testid={`badge-maker-reputation-${m.makerId}`}>
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  {(m.reputation / 10).toFixed(1)}
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-maker-tagline-${m.makerId}`}>
                {m.tagline}
              </p>

              {m.description && (
                <p className="mt-2 text-xs text-muted-foreground" data-testid={`text-maker-desc-${m.makerId}`}>
                  {m.description}
                </p>
              )}

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-maker-reviews-${m.makerId}`}>
                Reviews placeholder: community feedback, safety notes, and fulfillment reliability.
              </div>
            </article>
          ))}
        </div>

        {!isLoading && makers.length === 0 && (
          <div className="mt-5 rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-makers">
            <div className="text-sm font-semibold">No makers found</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {query ? "Try a different search term" : "No makers have been added yet"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
