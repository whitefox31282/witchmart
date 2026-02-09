import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, MapPin, AlertCircle } from "lucide-react";

interface HecatesNode {
  id: string;
  name: string;
  region: string;
  zone: string;
  description: string;
  category: string;
  publicInfo: string;
}

export default function HecatesHighwayPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const { data: nodes, isLoading, error } = useQuery({
    queryKey: ["hecates-nodes", selectedRegion],
    queryFn: async () => {
      const url = new URL("http://localhost:5000/api/hecates-highway/nodes");
      if (selectedRegion) {
        url.searchParams.set("region", selectedRegion);
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch nodes");
      const data = await response.json();
      return data.data || [];
    },
  });

  const regions = ["northern", "eastern", "southern", "western", "central"];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-3xl border bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Hecate's Highway</h1>
        </div>
        <p className="text-lg text-slate-300 mb-4">
          A safe, anonymous network of community support nodes. Hecate's Highway honors those seeking aid, refuge, or
          connection without surveillance or judgment.
        </p>
        <p className="text-sm text-slate-400">
          No tracking. No location data. No device identification. Just community compassion.
        </p>
      </section>

      {/* Region Filter */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Find Sanctuary by Region
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion("")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedRegion === ""
                ? "bg-primary text-white"
                : "border bg-card hover:bg-muted"
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full font-semibold transition capitalize ${
                selectedRegion === region
                  ? "bg-primary text-white"
                  : "border bg-card hover:bg-muted"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </section>

      {/* Nodes List */}
      <section className="space-y-4">
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">Loading sanctuary nodes...</div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Unable to load nodes. Please try again later.</span>
          </div>
        )}

        {nodes && nodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No nodes found in this region. Check back soon.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {nodes?.map((node: HecatesNode) => (
              <div
                key={node.id}
                className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{node.name}</h3>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                        {node.region}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary capitalize">
                        {node.zone}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{node.description}</p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">
                      Public Information
                    </span>
                    <p>{node.publicInfo}</p>
                  </div>
                  <div>
                    <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">
                      Category
                    </span>
                    <p className="capitalize">{node.category}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    All connection methods are safe and private. No external data collection.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Information Section */}
      <section className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">About Hecate's Highway</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Hecate's Highway is inspired by the goddess Hecate—guardian of boundaries, protector of travelers, and
            keeper of safe passage. This network honors those navigating difficult transitions with safety, dignity,
            and compassion.
          </p>
          <p>
            <strong>Privacy First:</strong> We do not track, store, or share your location. Sessions are ephemeral—they
            exist only as long as needed. No device IDs. No profiling.
          </p>
          <p>
            <strong>Community-Led:</strong> Sanctuary nodes are managed by trusted community members. Reports of
            misconduct are taken seriously.
          </p>
          <p>
            <strong>Trauma-Informed:</strong> Our design prioritizes psychological safety and recognizes trauma. Language
            is supportive, never alarming.
          </p>
        </div>
      </section>
    </div>
  );
}
