import { useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";

type Item = {
  id: string;
  title: string;
  type: "product" | "service";
  category: string;
  mode: "local" | "virtual";
  priceNote: string;
};

const MOCK_ITEMS: Item[] = [
  {
    id: "ps-201",
    title: "Basic Repair Clinic (group)",
    type: "service",
    category: "repair",
    mode: "local",
    priceNote: "$ — sliding scale (placeholder)",
  },
  {
    id: "ps-202",
    title: "Shelf-Stable Pantry Starter",
    type: "product",
    category: "ag/food",
    mode: "local",
    priceNote: "$ — coop price (placeholder)",
  },
  {
    id: "ps-203",
    title: "Safety & Planning Workshop",
    type: "service",
    category: "classes",
    mode: "virtual",
    priceNote: "$ — member discount (placeholder)",
  },
];

export default function ProductsServices() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_ITEMS;
    return MOCK_ITEMS.filter((i) =>
      [i.title, i.type, i.category, i.mode].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-products-title">
          Products & Services
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-products-subtitle">
          A shop/gallery-style overview: survival tech, handmade goods, ag/food, repair, and classes. (Mock data for now.)
        </p>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products & services…"
              className="wm-focus-ring w-full rounded-xl border bg-background px-10 py-2.5 text-sm shadow-sm"
              data-testid="input-products-search"
            />
          </div>
          <div className="text-xs text-muted-foreground" data-testid="text-products-count">
            Showing {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <article key={it.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-item-${it.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-item-title-${it.id}`}>
                    {it.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-item-meta-${it.id}`}>
                    {it.type} • {it.category} • {it.mode}
                  </div>
                </div>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-item-price-${it.id}`}>
                {it.priceNote}
              </div>

              <button
                className="wm-focus-ring mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                data-testid={`button-item-view-${it.id}`}
                onClick={() => {
                  // mock interaction
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                View details (placeholder)
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
