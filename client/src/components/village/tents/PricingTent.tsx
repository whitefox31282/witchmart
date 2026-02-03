import BackToVillage from "../BackToVillage";

interface PricingTentProps {
  onReturn: () => void;
}

export default function PricingTent({ onReturn }: PricingTentProps) {
  return (
    <div className="tent-interior tent-counting" data-testid="tent-pricing">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Pricing & Transparency</h1>
          <p>The Counting House</p>
        </header>

        <div className="scroll-display" style={{ marginBottom: 24 }}>
          <p>
            Where your dollar goes, how funds are governed, and how we keep the system accessible.
          </p>
        </div>

        <div className="wooden-table">
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 20 }}>
            Where Your Dollar Goes
          </h2>
          
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Platform Development", percent: 40, desc: "Building and maintaining the cooperative infrastructure" },
              { label: "Node Support", percent: 25, desc: "Resources for local sanctuary nodes and community hubs" },
              { label: "Safety & Moderation", percent: 15, desc: "Ensuring community guidelines and member protection" },
              { label: "Cooperative Reserve", percent: 15, desc: "Emergency fund and future expansion" },
              { label: "Governance Operations", percent: 5, desc: "Member voting systems and transparency reporting" },
            ].map((item, i) => (
              <div key={i} className="runestone">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>{item.label}</h3>
                  <span style={{ color: "#d4af37", fontWeight: "bold" }}>{item.percent}%</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>{item.desc}</p>
                <div style={{ 
                  marginTop: 8, 
                  height: 8, 
                  background: "rgba(0,0,0,0.3)", 
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: `${item.percent}%`, 
                    height: "100%", 
                    background: "linear-gradient(90deg, #8b6914, #d4af37)",
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="runestone" style={{ marginTop: 24 }}>
          <h3>Member Oversight</h3>
          <p>
            As a cooperative, members have the right to review financial decisions and vote on major 
            expenditures. Quarterly transparency reports will be published openly once Phase 5 launches.
          </p>
        </div>

        <div className="runestone">
          <h3>The Cooperative Model</h3>
          <p style={{ marginBottom: 12 }}>
            WitchMart operates on cooperative principles:
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "One member, one vote",
              "Transparent budgeting",
              "No hidden fees or algorithms",
              "Value stays in the community",
              "Decisions accountable to members"
            ].map((item, i) => (
              <li key={i} style={{ paddingLeft: 16, marginBottom: 4, position: "relative" }}>
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
