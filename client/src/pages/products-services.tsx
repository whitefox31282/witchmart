import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBag } from "lucide-react";
import type { ProductService } from "@shared/schema";

export default function ProductsServices() {
  const [query, setQuery] = useState("");

  const { data: items = [], isLoading, error } = useQuery<ProductService[]>({
    queryKey: ["/api/products", query],
    queryFn: async () => {
      const url = query ? `/api/products?q=${encodeURIComponent(query)}` : "/api/products";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-products-title">
          Products & Services
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-products-subtitle">
          A shop/gallery-style overview: survival tech, handmade goods, ag/food, repair, and classes.
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
            {isLoading ? "Loading..." : `Showing ${items.length} item${items.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" data-testid="error-products">
            Failed to load products. Please try again.
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.id} className="rounded-2xl border bg-card p-5 shadow-sm" data-testid={`card-item-${it.itemId}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold" data-testid={`text-item-title-${it.itemId}`}>
                    {it.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground" data-testid={`text-item-meta-${it.itemId}`}>
                    {it.type} • {it.category} • {it.mode}
                  </div>
                </div>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>

              {it.description && (
                <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-item-desc-${it.itemId}`}>
                  {it.description}
                </p>
              )}

              <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid={`text-item-price-${it.itemId}`}>
                {it.priceNote}
              </div>

              <button
                className="wm-focus-ring mt-4 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                data-testid={`button-item-view-${it.itemId}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                View details (placeholder)
              </button>
            </article>
          ))}
        </div>

        {!isLoading && items.length === 0 && (
          <div className="mt-5 rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-products">
            <div className="text-sm font-semibold">No products found</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {query ? "Try a different search term" : "No products have been added yet"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
