import BackToVillage from "../BackToVillage";

interface MakersTentProps {
  onReturn: () => void;
}

export default function MakersTent({ onReturn }: MakersTentProps) {
  return (
    <div className="tent-interior tent-workshop" data-testid="tent-makers">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Makers & Guilds</h1>
          <p>Craft Workshop</p>
        </header>

        <div className="hanging-banner">
          <span>Meet the Makers</span>
        </div>

        <div className="scroll-display" style={{ marginBottom: 24 }}>
          <p>
            Profiles, craft categories, reputation, and reviews—designed for human trust rather than corporate metrics.
          </p>
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {[
            { name: "Pottery & Ceramics", icon: "🏺", desc: "Handcrafted vessels, ritual bowls, and sacred containers" },
            { name: "Herbcraft", icon: "🌿", desc: "Medicinal herbs, tinctures, and botanical preparations" },
            { name: "Leatherwork", icon: "🛡️", desc: "Journals, pouches, belts, and protective gear" },
            { name: "Metalwork", icon: "⚔️", desc: "Jewelry, tools, ritual blades, and decorative pieces" },
            { name: "Textiles", icon: "🧵", desc: "Weavings, altar cloths, cloaks, and ceremonial garments" },
            { name: "Woodcraft", icon: "🪵", desc: "Wands, staffs, runes, and carved sacred objects" },
          ].map((guild, i) => (
            <div key={i} className="runestone">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "2rem" }}>{guild.icon}</span>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{guild.name}</h3>
                  <p style={{ fontSize: "0.9rem", margin: 0 }}>{guild.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wooden-table" style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 16 }}>
            Guild Formation
          </h2>
          <p style={{ color: "#c5baa8", lineHeight: 1.7 }}>
            Guilds are forming for shared skills and mutual support. As WitchMart grows into Phase 2, 
            makers will be able to create profiles, list their crafts, and build reputation based on 
            human trust—not algorithms.
          </p>
          <p style={{ color: "#a89070", marginTop: 16, fontStyle: "italic" }}>
            Phase 2 coming soon. Check back for maker registration.
          </p>
        </div>
      </div>
    </div>
  );
}
