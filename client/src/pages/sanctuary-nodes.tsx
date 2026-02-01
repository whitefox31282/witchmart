import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";

type Node = {
  id: string;
  name: string;
  region: string;
  city: string;
  specialties: string[];
  nextEvent: string;
  contact: string;
};

const MOCK_NODES: Node[] = [
  {
    id: "wm-001",
    name: "Green Hollow Node",
    region: "Appalachia",
    city: "Asheville, NC",
    specialties: ["mutual aid", "classes", "repair"],
    nextEvent: "Community skillshare (placeholder)",
    contact: "node@witchmart.org",
  },
  {
    id: "wm-002",
    name: "Harbor Lantern Node",
    region: "Coastal",
    city: "Portland, ME",
    specialties: ["makers market", "food", "sanctuary"],
    nextEvent: "Seasonal market night (placeholder)",
    contact: "node@witchmart.org",
  },
  {
    id: "wm-003",
    name: "Ironwood Circle",
    region: "Midwest",
    city: "Madison, WI",
    specialties: ["survival tech", "guild meetups", "training"],
    nextEvent: "Node orientation (placeholder)",
    contact: "node@witchmart.org",
  },
];

export default function SanctuaryNodes() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_NODES;
    return MOCK_NODES.filter((n) =>
      [n.name, n.region, n.city, n.specialties.join(" ")].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

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
            Showing {filtered.length} node{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filtered.map((node) => (
            <article key={node.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-node-${node.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-node-name-${node.id}`}>
                    {node.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span data-testid={`text-node-city-${node.id}`}>{node.city}</span>
                    <span aria-hidden="true">•</span>
                    <span data-testid={`text-node-region-${node.id}`}>{node.region}</span>
                  </div>
                </div>
                <span className="rounded-full border bg-background px-2.5 py-1 text-xs" data-testid={`badge-node-id-${node.id}`}>
                  {node.id}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {node.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs" data-testid={`badge-node-specialty-${node.id}-${s.replaceAll(" ", "_")}`}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                <div data-testid={`text-node-event-${node.id}`}>
                  <span className="font-semibold text-foreground">Next:</span> {node.nextEvent}
                </div>
                <div data-testid={`text-node-contact-${node.id}`}>
                  <span className="font-semibold text-foreground">Contact:</span> {node.contact}
                </div>
              </div>

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-node-safety-${node.id}`}>
                Safety note: all events follow posted community guidelines and local laws. (Placeholder.)
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
