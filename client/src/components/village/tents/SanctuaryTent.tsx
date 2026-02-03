import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, X } from "lucide-react";
import BackToVillage from "../BackToVillage";
import type { SanctuaryNode } from "@shared/schema";

interface SanctuaryTentProps {
  onReturn: () => void;
}

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
};

export default function SanctuaryTent({ onReturn }: SanctuaryTentProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NodeFormData>(initialFormData);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ status: string; data: SanctuaryNode[] }>({
    queryKey: ["/api/nodes"],
    queryFn: async () => {
      const response = await fetch("/api/nodes");
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

  return (
    <div className="tent-interior tent-map" data-testid="tent-sanctuary">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Sanctuary Nodes</h1>
          <p>Traveler's Map Tent</p>
        </header>

        <div className="wooden-table">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", margin: 0 }}>
              Node Directory
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="back-to-village"
              style={{ position: "relative", top: 0, left: 0 }}
              data-testid="button-add-node"
            >
              <Plus size={16} />
              <span>Add a Node</span>
            </button>
          </div>

          {isLoading ? (
            <p style={{ color: "#a89070" }}>Loading nodes...</p>
          ) : nodes.length === 0 ? (
            <p style={{ color: "#a89070" }}>No sanctuary nodes yet. Be the first to add one!</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {nodes.map((node) => (
                <div key={node.id} className="runestone" data-testid={`node-${node.nodeId}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ marginBottom: 4 }}>{node.name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8b6914", fontSize: "0.9rem" }}>
                        <MapPin size={14} />
                        <span>{node.city || node.location}</span>
                        {node.region && <span>• {node.region}</span>}
                      </div>
                    </div>
                    <span style={{ 
                      background: "rgba(212, 175, 55, 0.2)", 
                      padding: "4px 12px", 
                      borderRadius: 4,
                      fontSize: "0.8rem",
                      color: "#d4af37"
                    }}>
                      {node.nodeType || "sanctuary"}
                    </span>
                  </div>
                  {node.description && (
                    <p style={{ marginTop: 12 }}>{node.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 200
          }}
          onClick={() => setShowForm(false)}
        >
          <div 
            className="wooden-table"
            style={{ maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", margin: 0 }}>
                Add Your Sanctuary
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "#a89070", cursor: "pointer" }}
              >
                <X size={24} />
              </button>
            </div>

            {submitSuccess && (
              <div style={{ background: "rgba(100, 150, 100, 0.3)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#90c090" }}>
                Your sanctuary has been added!
              </div>
            )}

            {submitError && (
              <div style={{ background: "rgba(150, 100, 100, 0.3)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#c09090" }}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Sacred Oak Grove"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-node-name"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>Type</label>
                  <select
                    value={formData.nodeType}
                    onChange={(e) => setFormData(prev => ({ ...prev, nodeType: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="select-node-type"
                  >
                    <option value="sanctuary">Sanctuary</option>
                    <option value="church">Church</option>
                    <option value="temple">Temple</option>
                    <option value="grove">Grove</option>
                    <option value="community_center">Community Center</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="123 Forest Lane, Portland, OR"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-node-location"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us about your sanctuary..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem",
                      resize: "vertical"
                    }}
                    data-testid="textarea-node-description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  style={{
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #8b6914 0%, #d4af37 100%)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1rem",
                    cursor: "pointer",
                    opacity: submitMutation.isPending ? 0.6 : 1
                  }}
                  data-testid="button-submit-node"
                >
                  {submitMutation.isPending ? "Adding..." : "Add to Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
