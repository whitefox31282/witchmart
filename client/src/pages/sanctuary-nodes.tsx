import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Search, Plus, X } from "lucide-react";
import type { SanctuaryNode } from "@shared/schema";

interface NodeFormData {
  name: string;
  nodeType: string;
  location: string;
  city: string;
  region: string;
  tradition: string;
  description: string;
  services: string;
  contactEmail: string;
  website: string;
  hours: string;
  accessibility: string;
  safetyNotes: string;
}

const initialFormData: NodeFormData = {
  name: "",
  nodeType: "sanctuary",
  location: "",
  city: "",
  region: "",
  tradition: "",
  description: "",
  services: "",
  contactEmail: "",
  website: "",
  hours: "",
  accessibility: "",
  safetyNotes: "",
};

export default function SanctuaryNodes() {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NodeFormData>(initialFormData);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<{ status: string; data: SanctuaryNode[] }>({
    queryKey: ["/api/nodes", query],
    queryFn: async () => {
      const url = query ? `/api/nodes?q=${encodeURIComponent(query)}` : "/api/nodes";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch nodes");
      return response.json();
    },
  });

  const nodes = data?.data || [];

  const submitMutation = useMutation({
    mutationFn: async (nodeData: NodeFormData) => {
      const response = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          name: nodeData.name,
          nodeType: nodeData.nodeType,
          location: nodeData.location,
          city: nodeData.city || undefined,
          region: nodeData.region || undefined,
          tradition: nodeData.tradition || undefined,
          description: nodeData.description,
          services: nodeData.services ? nodeData.services.split(",").map(s => s.trim()) : [],
          contactEmail: nodeData.contactEmail || undefined,
          website: nodeData.website || undefined,
          hours: nodeData.hours || undefined,
          accessibility: nodeData.accessibility || undefined,
          safetyNotes: nodeData.safetyNotes || undefined,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to submit");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setFormData(initialFormData);
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 2000);
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!formData.name || !formData.description || !formData.location) {
      setSubmitError("Please fill in name, location, and description.");
      return;
    }
    submitMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof NodeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-nodes-title">
          Sanctuary Nodes
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-nodes-subtitle">
          Find sacred spaces, community hubs, and gathering places. Churches, temples, synagogues, groves, and more.
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
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground" data-testid="text-nodes-count">
              {isLoading ? "Loading..." : `${nodes.length} node${nodes.length === 1 ? "" : "s"}`}
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-500"
              data-testid="button-add-node"
            >
              <Plus className="h-4 w-4" />
              Add Your Sanctuary
            </button>
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
                    <span data-testid={`text-node-city-${node.nodeId}`}>{node.city || node.location}</span>
                    {node.region && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span data-testid={`text-node-region-${node.nodeId}`}>{node.region}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="rounded-full border bg-background px-2.5 py-1 text-xs" data-testid={`badge-node-id-${node.nodeId}`}>
                  {node.nodeType || "sanctuary"}
                </span>
              </div>

              {node.description && (
                <p className="mt-3 text-sm text-muted-foreground" data-testid={`text-node-desc-${node.nodeId}`}>
                  {node.description}
                </p>
              )}

              {node.specialties && node.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {node.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-xs" data-testid={`badge-node-specialty-${node.nodeId}-${s.replaceAll(" ", "_")}`}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                {node.nextEvent && (
                  <div data-testid={`text-node-event-${node.nodeId}`}>
                    <span className="font-semibold text-foreground">Next:</span> {node.nextEvent}
                  </div>
                )}
                {node.contactEmail && (
                  <div data-testid={`text-node-contact-${node.nodeId}`}>
                    <span className="font-semibold text-foreground">Contact:</span> {node.contactEmail}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {!isLoading && nodes.length === 0 && (
          <div className="mt-5 rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-nodes">
            <div className="text-sm font-semibold">No nodes found</div>
            <p className="mt-1 text-sm text-muted-foreground">
              {query ? "Try a different search term" : "Be the first to add a sanctuary node!"}
            </p>
          </div>
        )}
      </section>

      {/* Add Sanctuary Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" data-testid="modal-add-node">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-amber-700/50 bg-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl text-amber-500">Add Your Sanctuary</h2>
              <button
                onClick={() => { setShowForm(false); setSubmitError(""); setSubmitSuccess(false); }}
                className="rounded-full p-2 text-white/70 hover:bg-white/10"
                data-testid="button-close-form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-orange-200/80">
              Share your church, temple, synagogue, grove, or community space with the network.
            </p>

            {submitSuccess && (
              <div className="mt-4 rounded-xl border border-green-500/50 bg-green-900/30 p-4 text-sm text-green-300">
                Your sanctuary has been added! Welcome to the network.
              </div>
            )}

            {submitError && (
              <div className="mt-4 rounded-xl border border-red-500/50 bg-red-900/30 p-4 text-sm text-red-300">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-orange-200">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Sacred Oak Grove"
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                    data-testid="input-node-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-200">Type</label>
                  <select
                    value={formData.nodeType}
                    onChange={(e) => handleInputChange("nodeType", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
                    data-testid="select-node-type"
                  >
                    <option value="sanctuary">Sanctuary</option>
                    <option value="church">Church</option>
                    <option value="temple">Temple</option>
                    <option value="synagogue">Synagogue</option>
                    <option value="mosque">Mosque</option>
                    <option value="grove">Grove</option>
                    <option value="coven">Coven</option>
                    <option value="community_center">Community Center</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., 123 Forest Lane, Portland, OR"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="input-node-location"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-orange-200">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g., Portland"
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                    data-testid="input-node-city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-200">Region/State</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    placeholder="e.g., Pacific Northwest"
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                    data-testid="input-node-region"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Tradition/Path</label>
                <input
                  type="text"
                  value={formData.tradition}
                  onChange={(e) => handleInputChange("tradition", e.target.value)}
                  placeholder="e.g., Wiccan, Druid, Interfaith, Non-denominational"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="input-node-tradition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Tell us about your space, what you offer, and who is welcome..."
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="textarea-node-description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Services Offered</label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => handleInputChange("services", e.target.value)}
                  placeholder="e.g., rituals, classes, mutual aid, food pantry (comma separated)"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="input-node-services"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-orange-200">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="contact@example.com"
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                    data-testid="input-node-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-200">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                    data-testid="input-node-website"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Hours</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleInputChange("hours", e.target.value)}
                  placeholder="e.g., Open circles on full moons, weekly gatherings Sundays 10am"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="input-node-hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-200">Accessibility Notes</label>
                <input
                  type="text"
                  value={formData.accessibility}
                  onChange={(e) => handleInputChange("accessibility", e.target.value)}
                  placeholder="e.g., Wheelchair accessible, ASL interpreters available"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                  data-testid="input-node-accessibility"
                />
              </div>

              <div className="rounded-xl border border-amber-700/40 bg-slate-700/50 p-4">
                <p className="text-xs text-orange-200/80">
                  By submitting, you confirm this is a real community space and agree to WitchMart's community guidelines.
                  All submissions are reviewed for safety.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(""); }}
                  className="rounded-full border border-orange-300/30 px-5 py-2.5 text-sm font-semibold text-orange-200 transition hover:bg-orange-200/10"
                  data-testid="button-cancel-form"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-500 disabled:opacity-50"
                  data-testid="button-submit-node"
                >
                  {submitMutation.isPending ? "Submitting..." : "Add to Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
