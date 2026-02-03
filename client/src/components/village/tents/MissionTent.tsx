import BackToVillage from "../BackToVillage";

interface MissionTentProps {
  onReturn: () => void;
}

export default function MissionTent({ onReturn }: MissionTentProps) {
  return (
    <div className="tent-interior tent-sacred" data-testid="tent-mission">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Mission + Support</h1>
          <p>Sacred Offering Tent</p>
        </header>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-block",
            padding: 24,
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
            borderRadius: "50%"
          }}>
            <span style={{ fontSize: "4rem" }}>🕯️</span>
          </div>
        </div>

        <div className="scroll-display" style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#3d2e0f", marginBottom: 16 }}>
            Our Mission
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            To build a member-owned cooperative economy that restores dignity, transparency, 
            and community power. We exist to serve makers, healers, farmers, and spiritual 
            communities—not to extract from them.
          </p>
        </div>

        <div className="wooden-table">
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 16 }}>
              Support the Network
            </h2>
            <p style={{ color: "#c5baa8", marginBottom: 24 }}>
              Voluntary contributions help sustain the cooperative infrastructure.
            </p>
            
            <div style={{
              display: "inline-block",
              padding: "20px 40px",
              background: "linear-gradient(135deg, rgba(139, 105, 20, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)",
              border: "2px solid #d4af37",
              borderRadius: 12,
              marginBottom: 24
            }}>
              <span style={{ 
                fontFamily: "'Cinzel', serif", 
                fontSize: "1.5rem", 
                color: "#d4af37",
                textShadow: "0 0 10px rgba(212, 175, 55, 0.5)"
              }}>
                $RavensEvermore
              </span>
            </div>

            <div className="runestone" style={{ textAlign: "left" }}>
              <h3>Voluntary Support Principles</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {[
                  "No pressure. Give only what feels right.",
                  "100% goes to cooperative operations.",
                  "Transparent reporting on fund usage.",
                  "Never required for membership or access.",
                  "Community-governed spending decisions."
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

        <div className="runestone" style={{ marginTop: 24 }}>
          <h3>What Your Support Enables</h3>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: 16 }}>
            {[
              { icon: "🛠️", text: "Platform development" },
              { icon: "🏕️", text: "Sanctuary node resources" },
              { icon: "🛡️", text: "Safety infrastructure" },
              { icon: "📊", text: "Transparency reporting" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
