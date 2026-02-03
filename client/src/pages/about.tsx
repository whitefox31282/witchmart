import "./about.css";

export default function About() {
  return (
    <div className="about-page" data-testid="page-about">
      <header className="about-header">
        <h1 className="about-title">About WitchMart</h1>
        
        <p className="about-intro">
          WitchMart is a member‑owned, Pagan‑aligned cooperative marketplace and sanctuary network. 
          It exists to restore dignity, transparency, and community power in a world where most systems 
          extract more than they give. WitchMart is built for people who want to trade, teach, heal, 
          create, and gather without surveillance, exploitation, or corporate gatekeeping.
        </p>
        
        <p className="about-intro">
          This cooperative is not a brand. It's a living ecosystem — a network of sanctuaries, makers, 
          guilds, and mutual‑aid nodes that honor every tradition and every path.
        </p>
      </header>

      <section className="about-section" data-testid="section-origins">
        <h2 className="section-title">Origins</h2>
        
        <p>
          WitchMart began as a response to a simple truth: people deserve systems that serve them, 
          not systems that drain them.
        </p>
        
        <p>
          Rev. Jon Bradley, the founder, grew up watching how communities thrive when people know 
          each other, trust each other, and build together. He saw firsthand how local networks — 
          neighbors helping neighbors — create resilience, dignity, and belonging. He also saw how 
          modern systems replaced that with extraction, surveillance, and profit‑first thinking.
        </p>
        
        <p>
          WitchMart is a reclamation of that older vision: a cooperative marketplace where the people 
          own the platform, the rules are visible, and the flows are transparent.
        </p>
        
        <p>It is built for:</p>
        <ul className="about-list">
          <li>makers</li>
          <li>healers</li>
          <li>farmers</li>
          <li>spiritual communities</li>
          <li>off‑grid families</li>
          <li>mutual‑aid organizers</li>
          <li>anyone who wants to participate in a fair, transparent, and spiritually aligned economy</li>
        </ul>
      </section>

      <section className="about-section" data-testid="section-founder">
        <h2 className="section-title">Meet the Founder</h2>
        
        <div className="founder-header">
          <p className="founder-name">Rev. Jon Bradley</p>
          <p className="founder-role">Founder • Cooperative Architect • Sanctuary Builder</p>
        </div>
        
        <p>
          Rev. Jon's mission is to build systems that protect people instead of exploiting them. 
          His leadership style is cooperative, transparent, and grounded in lived experience. 
          He designs WitchMart as a sanctuary economy — one where:
        </p>
        
        <ul className="about-list">
          <li>members own the platform</li>
          <li>rules are visible</li>
          <li>decisions are accountable</li>
          <li>safety is non‑negotiable</li>
          <li>dignity is the baseline</li>
        </ul>
        
        <p>
          WitchMart is the expression of that philosophy: a place where people can build together 
          without being mined, tracked, or reduced to data points.
        </p>
      </section>

      <section className="about-section" data-testid="section-manifesto">
        <h2 className="section-title">Manifesto</h2>
        
        <div className="manifesto-grid">
          <div className="manifesto-item">
            <h3>Transparency first</h3>
            <p>Rules, flows, and decisions must be visible. No hidden algorithms. No silent changes.</p>
          </div>
          
          <div className="manifesto-item">
            <h3>Cooperation over extraction</h3>
            <p>Value flows toward the people who create it — not toward a corporation.</p>
          </div>
          
          <div className="manifesto-item">
            <h3>Accessibility and dignity</h3>
            <p>Every member deserves clear language, fair pricing, and a space where they are treated with respect.</p>
          </div>
          
          <div className="manifesto-item">
            <h3>Resilience through local nodes</h3>
            <p>Communities thrive when they have local sanctuary points — places to gather, trade, teach, and support each other.</p>
          </div>
          
          <div className="manifesto-item">
            <h3>Safety culture</h3>
            <p>Clear boundaries, clear expectations, and trauma‑informed design. No exploitation. No surveillance.</p>
          </div>
          
          <div className="manifesto-item">
            <h3>Member ownership means member oversight</h3>
            <p>The cooperative belongs to the people who use it. Decisions are accountable to the community.</p>
          </div>
        </div>
      </section>

      <section className="about-section" data-testid="section-timeline">
        <h2 className="section-title">Timeline / Vision</h2>
        
        <p className="timeline-intro">
          WitchMart is being built in phases — each one strengthening the cooperative foundation.
        </p>
        
        <div className="timeline">
          <div className="timeline-phase">
            <h3 className="phase-title">Phase 1 — Sanctuary Network <span className="phase-now">(Now)</span></h3>
            <ul className="phase-list">
              <li>Launch of the Sanctuary Nodes directory</li>
              <li>Any tradition, any community, any path may add their sanctuary</li>
              <li>Zero gatekeeping, zero hierarchy</li>
              <li>Safety and transparency standards published openly</li>
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h3 className="phase-title">Phase 2 — Makers & Guilds</h3>
            <ul className="phase-list">
              <li>Maker profiles</li>
              <li>Craft categories</li>
              <li>Reputation based on human trust, not algorithms</li>
              <li>Guild formation for shared skills and mutual support</li>
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h3 className="phase-title">Phase 3 — Cooperative Governance</h3>
            <ul className="phase-list">
              <li>Member voting</li>
              <li>Public decision logs</li>
              <li>Transparent budgeting</li>
              <li>Community‑driven rule updates</li>
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h3 className="phase-title">Phase 4 — Marketplace & Mutual Aid</h3>
            <ul className="phase-list">
              <li>Local trade</li>
              <li>Skill‑sharing</li>
              <li>Resource exchanges</li>
              <li>Sanctuary‑based pickup points</li>
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h3 className="phase-title">Phase 5 — Public Reporting</h3>
            <ul className="phase-list">
              <li>Quarterly transparency reports</li>
              <li>Open financials</li>
              <li>Community metrics</li>
              <li>Member‑owned data, always</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
