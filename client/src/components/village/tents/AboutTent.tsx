import BackToVillage from "../BackToVillage";

interface AboutTentProps {
  onReturn: () => void;
}

export default function AboutTent({ onReturn }: AboutTentProps) {
  return (
    <div className="tent-interior tent-longhouse" data-testid="tent-about">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>About WitchMart</h1>
          <p>Chieftain's Longhouse</p>
        </header>

        <div className="scroll-display">
          <p style={{ marginBottom: 16 }}>
            WitchMart is a member-owned, Pagan-aligned cooperative marketplace and sanctuary network. 
            It exists to restore dignity, transparency, and community power in a world where most systems 
            extract more than they give. WitchMart is built for people who want to trade, teach, heal, 
            create, and gather without surveillance, exploitation, or corporate gatekeeping.
          </p>
          <p>
            This cooperative is not a brand. It's a living ecosystem — a network of sanctuaries, makers, 
            guilds, and mutual-aid nodes that honor every tradition and every path.
          </p>
        </div>

        <div className="wooden-table">
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 16 }}>Origins</h2>
          <p style={{ color: "#c5baa8", marginBottom: 12, lineHeight: 1.7 }}>
            WitchMart began as a response to a simple truth: people deserve systems that serve them, 
            not systems that drain them.
          </p>
          <p style={{ color: "#c5baa8", marginBottom: 12, lineHeight: 1.7 }}>
            Rev. Jon Bradley, the founder, grew up watching how communities thrive when people know 
            each other, trust each other, and build together. He saw firsthand how local networks — 
            neighbors helping neighbors — create resilience, dignity, and belonging. He also saw how 
            modern systems replaced that with extraction, surveillance, and profit-first thinking.
          </p>
          <p style={{ color: "#c5baa8", marginBottom: 16, lineHeight: 1.7 }}>
            WitchMart is a reclamation of that older vision: a cooperative marketplace where the people 
            own the platform, the rules are visible, and the flows are transparent.
          </p>
          <p style={{ color: "#a89070", marginBottom: 8 }}>It is built for:</p>
          <ul style={{ listStyle: "none", padding: 0, color: "#c5baa8" }}>
            {["makers", "healers", "farmers", "spiritual communities", "off-grid families", 
              "mutual-aid organizers", "anyone who wants to participate in a fair, transparent, and spiritually aligned economy"
            ].map((item, i) => (
              <li key={i} style={{ paddingLeft: 16, marginBottom: 4, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hanging-banner">
          <span>Rev. Jon Bradley — Founder</span>
        </div>

        <div className="runestone">
          <h3>Meet the Founder</h3>
          <p style={{ fontStyle: "italic", color: "#8b6914", marginBottom: 12 }}>
            Founder • Cooperative Architect • Sanctuary Builder
          </p>
          <p style={{ marginBottom: 12 }}>
            Rev. Jon's mission is to build systems that protect people instead of exploiting them. 
            His leadership style is cooperative, transparent, and grounded in lived experience. 
            He designs WitchMart as a sanctuary economy — one where:
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["members own the platform", "rules are visible", "decisions are accountable", 
              "safety is non-negotiable", "dignity is the baseline"
            ].map((item, i) => (
              <li key={i} style={{ paddingLeft: 16, marginBottom: 4, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 12 }}>
            WitchMart is the expression of that philosophy: a place where people can build together 
            without being mined, tracked, or reduced to data points.
          </p>
        </div>

        <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 20, marginTop: 32 }}>
          Manifesto
        </h2>
        
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {[
            { title: "Transparency first", text: "Rules, flows, and decisions must be visible. No hidden algorithms. No silent changes." },
            { title: "Cooperation over extraction", text: "Value flows toward the people who create it — not toward a corporation." },
            { title: "Accessibility and dignity", text: "Every member deserves clear language, fair pricing, and a space where they are treated with respect." },
            { title: "Resilience through local nodes", text: "Communities thrive when they have local sanctuary points — places to gather, trade, teach, and support each other." },
            { title: "Safety culture", text: "Clear boundaries, clear expectations, and trauma-informed design. No exploitation. No surveillance." },
            { title: "Member ownership means member oversight", text: "The cooperative belongs to the people who use it. Decisions are accountable to the community." },
          ].map((item, i) => (
            <div key={i} className="runestone">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="wooden-table" style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 16 }}>
            Timeline / Vision
          </h2>
          <p style={{ color: "#a89070", fontStyle: "italic", marginBottom: 24, textAlign: "center" }}>
            WitchMart is being built in phases — each one strengthening the cooperative foundation.
          </p>
          
          <div className="timeline-board">
            {[
              { phase: "Phase 1 — Sanctuary Network (Now)", items: [
                "Launch of the Sanctuary Nodes directory",
                "Any tradition, any community, any path may add their sanctuary",
                "Zero gatekeeping, zero hierarchy",
                "Safety and transparency standards published openly"
              ]},
              { phase: "Phase 2 — Makers & Guilds", items: [
                "Maker profiles",
                "Craft categories",
                "Reputation based on human trust, not algorithms",
                "Guild formation for shared skills and mutual support"
              ]},
              { phase: "Phase 3 — Cooperative Governance", items: [
                "Member voting",
                "Public decision logs",
                "Transparent budgeting",
                "Community-driven rule updates"
              ]},
              { phase: "Phase 4 — Marketplace & Mutual Aid", items: [
                "Local trade",
                "Skill-sharing",
                "Resource exchanges",
                "Sanctuary-based pickup points"
              ]},
              { phase: "Phase 5 — Public Reporting", items: [
                "Quarterly transparency reports",
                "Open financials",
                "Community metrics",
                "Member-owned data, always"
              ]},
            ].map((section, i) => (
              <div key={i} className="timeline-phase">
                <h4>{section.phase}</h4>
                <ul>
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
