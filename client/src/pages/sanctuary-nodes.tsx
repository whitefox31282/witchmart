import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import type { SanctuaryNode } from "@shared/schema";

export default function SanctuaryNodes() {
  const [query, setQuery] = useState("");

  const { data: nodes = [], isLoading, error } = useQuery<SanctuaryNode[]>({
    queryKey: ["/api/nodes", query],
    queryFn: async () => {
      const url = query ? `/api/nodes?q=${encodeURIComponent(query)}` : "/api/nodes";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch nodes");
      return response.json();
    },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-nodes-title">
          Sanctuary Nodes
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-nodes-subtitle">
          Search by region, city, or specialty. (Interactive map placeholder—can be added next.)
        </p>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes (region, city, specialty)…"
              className="wm-focus-ring w-full rounded-xl border bg-background px-10 py-2.5 text-sm shadow-sm"
              data-testid="input-node-search"
            />
          </div>
          <div className="text-xs text-muted-foreground" data-testid="text-nodes-count">
            {isLoading ? "Loading..." : `Showing ${nodes.length} node${nodes.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" data-testid="error-nodes">
            Failed to load nodes. Please try again.
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {nodes.map((node) => (
            <article key={node.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-node-${node.nodeId}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-node-name-${node.nodeId}`}>
                    {node.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span data-testid={`text-node-city-${node.nodeId}`}>{node.city}</span>
                    <span aria-hidden="true">•</span>
                    <span data-testid={`text-node-region-${node.nodeId}`}>{node.region}</span>
                  </div>
                </div>
                <span className="rounded-full border bg-background px-2.5 py-1 text-xs" data-testid={`badge-node-id-${node.nodeId}`}>
                  {node.nodeId}
                </span>
              </div>

              {node.description && (
                <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-node-desc-${node.nodeId}`}>
                  {node.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {node.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs" data-testid={`badge-node-specialty-${node.nodeId}-${s.replaceAll(" ", "_")}`}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                {node.nextEvent && (
                  <div data-testid={`text-node-event-${node.nodeId}`}>
                    <span className="font-semibold text-foreground">Next:</span> {node.nextEvent}
                  </div>
                )}
                <div data-testid={`text-node-contact-${node.nodeId}`}>
                  <span className="font-semibold text-foreground">Contact:</span> {node.contactEmail}
                </div>
              </div>

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-node-safety-${node.nodeId}`}>
                Safety note: all events follow posted community guidelines and local laws. (Placeholder.)
              </div>
            </article>
          ))}
        </div>

        {!isLoading && nodes.length === 0 && (
          <div className="mt-5 rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-nodes">
            <div className="text-sm font-semibold">No nodes found</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {query ? "Try a different search term" : "No sanctuary nodes have been added yet"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
