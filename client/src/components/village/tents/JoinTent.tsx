import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import BackToVillage from "../BackToVillage";

interface JoinTentProps {
  onReturn: () => void;
}

export default function JoinTent({ onReturn }: JoinTentProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "member",
    message: ""
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/member-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          name: formData.name,
          email: formData.email,
          interest: formData.interest,
          message: formData.message
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
      setFormData({ name: "", email: "", interest: "member", message: "" });
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!formData.name || !formData.email) {
      setSubmitError("Please fill in your name and email.");
      return;
    }
    submitMutation.mutate();
  };

  return (
    <div className="tent-interior tent-gathering" data-testid="tent-join">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Join the Cooperative</h1>
          <p>Communal Gathering Tent</p>
        </header>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-block",
            padding: 24,
            background: "radial-gradient(circle, rgba(255, 100, 30, 0.2) 0%, transparent 70%)",
            borderRadius: "50%"
          }}>
            <span style={{ fontSize: "4rem" }}>🔥</span>
          </div>
        </div>

        <div className="hanging-banner">
          <span>Join the Circle</span>
        </div>

        <div className="scroll-display" style={{ marginBottom: 32 }}>
          <p style={{ textAlign: "center" }}>
            Welcome to the gathering fire. Here, we come together as equals—makers, healers, 
            seekers, and builders—united by a vision of cooperative dignity.
          </p>
        </div>

        <div className="wooden-table" style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 20, textAlign: "center" }}>
            Membership Form
          </h2>

          {submitSuccess ? (
            <div style={{ 
              textAlign: "center", 
              padding: 24, 
              background: "rgba(100, 150, 100, 0.2)", 
              borderRadius: 12 
            }}>
              <span style={{ fontSize: "3rem" }}>🎉</span>
              <h3 style={{ color: "#90c090", marginTop: 12 }}>Welcome to the Circle!</h3>
              <p style={{ color: "#c5baa8" }}>We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError && (
                <div style={{ 
                  background: "rgba(150, 100, 100, 0.3)", 
                  padding: 12, 
                  borderRadius: 8, 
                  marginBottom: 16, 
                  color: "#c09090" 
                }}>
                  {submitError}
                </div>
              )}

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="How shall we call you?"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-join-name"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-join-email"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>
                    I'm interested in...
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#c5baa8",
                      fontSize: "1rem"
                    }}
                    data-testid="select-join-interest"
                  >
                    <option value="member">Becoming a member</option>
                    <option value="maker">Joining as a maker</option>
                    <option value="node">Starting a sanctuary node</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="support">Supporting the mission</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6, fontSize: "0.9rem" }}>
                    Anything else? (optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your vision..."
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
                    data-testid="textarea-join-message"
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
                  data-testid="button-submit-join"
                >
                  {submitMutation.isPending ? "Joining..." : "Join the Circle"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="runestone" style={{ marginTop: 32 }}>
          <h3>What Membership Means</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "One member, one vote in cooperative decisions",
              "Access to all sanctuary nodes and community resources",
              "Ability to list as a maker or start a guild",
              "Participation in governance and transparency reporting",
              "Part of a community that protects, not extracts"
            ].map((item, i) => (
              <li key={i} style={{ paddingLeft: 16, marginBottom: 8, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
