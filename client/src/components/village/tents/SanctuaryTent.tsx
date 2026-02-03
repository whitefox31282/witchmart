import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, X } from "lucide-react";
import BackToVillage from "../BackToVillage";
import type { SanctuaryNode } from "@shared/schema";

interface SanctuaryTentProps {
  onReturn: () => void;
}

interface NodeFormData {
  whoYouAre: string;
  whatYoureAbout: string;
  howYouGotStarted: string;
  whenYouWereBorn: string;
  whoLicensedYou: string;
  tradition: string;
  lineage: string;
  offerings: string;
  location: string;
  accessibilityNotes: string;
  safetyNotes: string;
  contactMethod: string;
  additionalNotes: string;
  name: string;
  nodeType: string;
}

const initialFormData: NodeFormData = {
  whoYouAre: "",
  whatYoureAbout: "",
  howYouGotStarted: "",
  whenYouWereBorn: "",
  whoLicensedYou: "",
  tradition: "",
  lineage: "",
  offerings: "",
  location: "",
  accessibilityNotes: "",
  safetyNotes: "",
  contactMethod: "",
  additionalNotes: "",
  name: "",
  nodeType: "sanctuary",
};

const formFields = [
  { key: "name", label: "Sanctuary Name", placeholder: "Sacred Oak Grove", required: true, type: "input" },
  { key: "nodeType", label: "Type", placeholder: "", required: false, type: "select", options: [
    { value: "sanctuary", label: "Sanctuary" },
    { value: "church", label: "Church" },
    { value: "temple", label: "Temple" },
    { value: "grove", label: "Grove" },
    { value: "community_center", label: "Community Center" },
  ]},
  { key: "whoYouAre", label: "Who You Are", placeholder: "Tell us about yourself or your organization...", required: true, type: "textarea" },
  { key: "whatYoureAbout", label: "What You're About", placeholder: "Your mission, values, and purpose...", required: true, type: "textarea" },
  { key: "howYouGotStarted", label: "How You Got Started", placeholder: "The origin story of your sanctuary...", required: false, type: "textarea" },
  { key: "whenYouWereBorn", label: "When You Were Born / Founded", placeholder: "Year or date of establishment...", required: false, type: "input" },
  { key: "whoLicensedYou", label: "Who Licensed You", placeholder: "Ordaining body, licensing authority, or self-ordained...", required: false, type: "input" },
  { key: "tradition", label: "Your Tradition", placeholder: "Wiccan, Druid, Heathen, Eclectic, etc...", required: false, type: "input" },
  { key: "lineage", label: "Your Lineage", placeholder: "Spiritual lineage or teaching tradition...", required: false, type: "input" },
  { key: "offerings", label: "Your Offerings", placeholder: "Services, classes, rituals, gatherings...", required: true, type: "textarea" },
  { key: "location", label: "Your Location", placeholder: "City, State, Country or 'Online'", required: true, type: "input" },
  { key: "accessibilityNotes", label: "Accessibility Notes", placeholder: "Wheelchair access, online options, sensory accommodations...", required: false, type: "textarea" },
  { key: "safetyNotes", label: "Safety Notes", placeholder: "Background check policy, safe space commitments...", required: false, type: "textarea" },
  { key: "contactMethod", label: "Contact Method", placeholder: "Email, website, or preferred contact...", required: true, type: "input" },
  { key: "additionalNotes", label: "Additional Notes", placeholder: "Anything else the community should know...", required: false, type: "textarea" },
];

const inputStyle = {
  width: "100%",
  padding: 12,
  background: "rgba(0,0,0,0.3)",
  border: "1px solid #4a3a2e",
  borderRadius: 6,
  color: "#e8dcc8",
  fontSize: "1rem",
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
          tradition: nodeData.tradition || undefined,
          description: `${nodeData.whoYouAre}\n\n${nodeData.whatYoureAbout}`,
          services: nodeData.offerings ? nodeData.offerings.split(",").map(s => s.trim()) : [],
          contactEmail: nodeData.contactMethod || undefined,
          metadata: {
            howYouGotStarted: nodeData.howYouGotStarted,
            whenYouWereBorn: nodeData.whenYouWereBorn,
            whoLicensedYou: nodeData.whoLicensedYou,
            lineage: nodeData.lineage,
            accessibilityNotes: nodeData.accessibilityNotes,
            safetyNotes: nodeData.safetyNotes,
            additionalNotes: nodeData.additionalNotes,
          },
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
    const requiredFields = formFields.filter(f => f.required);
    const missing = requiredFields.filter(f => !formData[f.key as keyof NodeFormData]);
    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.map(f => f.label).join(", ")}`);
      return;
    }
    submitMutation.mutate(formData);
  };

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="tent-interior tent-map tent-allfather-bg" data-testid="tent-sanctuary">
      <BackToVillage onReturn={onReturn} />
      
      {/* All-Father Travel Form Background Placeholder */}
      <div className="allfather-overlay" />
      
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
              <span>Add Your Node</span>
            </button>
          </div>

          {isLoading ? (
            <p style={{ color: "#c5baa8" }}>Loading nodes...</p>
          ) : nodes.length === 0 ? (
            <p style={{ color: "#c5baa8" }}>No sanctuary nodes yet. Be the first to add one!</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {nodes.map((node) => (
                <div key={node.id} className="runestone" data-testid={`node-${node.nodeId}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ marginBottom: 4, color: "#e8dcc8" }}>{node.name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d4af37", fontSize: "0.9rem" }}>
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
                    <p style={{ marginTop: 12, color: "#c5baa8" }}>{node.description}</p>
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
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 20,
            paddingTop: 60,
            zIndex: 200,
            overflowY: "auto"
          }}
          onClick={() => setShowForm(false)}
          data-testid="modal-add-node"
        >
          <div 
            className="wooden-table"
            style={{ maxWidth: 600, width: "100%", marginBottom: 40 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", margin: 0 }}>
                Add Your Sanctuary Node
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "#c5baa8", cursor: "pointer" }}
                data-testid="button-close-modal"
              >
                <X size={24} />
              </button>
            </div>

            {submitSuccess && (
              <div style={{ background: "rgba(100, 150, 100, 0.3)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#a0d0a0" }}>
                Your sanctuary has been added to the network!
              </div>
            )}

            {submitError && (
              <div style={{ background: "rgba(150, 100, 100, 0.3)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#d0a0a0" }}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 16 }}>
                {formFields.map((field) => (
                  <div key={field.key}>
                    <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>
                      {field.label} {field.required && "*"}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key as keyof NodeFormData]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        style={inputStyle}
                        data-testid={`select-${field.key}`}
                      >
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={formData[field.key as keyof NodeFormData]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                        data-testid={`textarea-${field.key}`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key as keyof NodeFormData]}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        data-testid={`input-${field.key}`}
                      />
                    )}
                  </div>
                ))}

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
                    opacity: submitMutation.isPending ? 0.6 : 1,
                    marginTop: 8
                  }}
                  data-testid="button-submit-node"
                >
                  {submitMutation.isPending ? "Adding to Network..." : "Add to the Network"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .tent-allfather-bg {
          position: relative;
        }
        .allfather-overlay {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 50% 30%, rgba(100, 80, 60, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, rgba(80, 60, 100, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        /* All-Father travel form placeholder - replace with actual asset when available */
        .allfather-overlay::before {
          content: "";
          position: absolute;
          top: 10%;
          right: 5%;
          width: 150px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(150, 130, 100, 0.1) 0%, transparent 70%);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
