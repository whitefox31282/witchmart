import { Link } from "wouter";
import BackToVillage from "../BackToVillage";
import { GUILDS } from "@/lib/guild-data";

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

        <div className="scroll-display" style={{ marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", fontStyle: "italic", margin: 0 }}>
            Where our elders come to teach — custom items, craft, knowledge, and tradition.
          </p>
        </div>

        <div className="hanging-banner">
          <span>Guild Halls</span>
        </div>

        <div className="scroll-display" style={{ marginBottom: 24 }}>
          <p>
            Profiles, craft categories, reputation, and reviews—designed for human trust rather than corporate metrics.
            Click on any guild to explore its members and subcategories.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {GUILDS.map((guild) => (
            <Link 
              key={guild.id} 
              href={guild.id === "game-creators" ? "/guild/game-creators" : `/guild/${guild.id}`} 
              style={{ textDecoration: "none" }}
              data-testid={`guild-tab-${guild.id}`}
            >
              <div 
                className="runestone guild-card" 
                style={{ 
                  cursor: "pointer", 
                  transition: "all 0.2s ease",
                  minHeight: "120px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: "2.2rem" }}>{guild.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 6, color: "#e8dcc8", fontSize: "1.1rem" }}>{guild.name}</h3>
                    <p style={{ fontSize: "0.85rem", margin: 0, color: "#c5baa8", lineHeight: 1.5 }}>
                      {guild.description}
                    </p>
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {guild.subcategories.slice(0, 3).map((sub) => (
                        <span 
                          key={sub.id}
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                            background: "rgba(212, 175, 55, 0.15)",
                            borderRadius: "3px",
                            color: "#d4af37",
                          }}
                        >
                          {sub.name}
                        </span>
                      ))}
                      {guild.subcategories.length > 3 && (
                        <span 
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                            background: "rgba(212, 175, 55, 0.1)",
                            borderRadius: "3px",
                            color: "#a89070",
                          }}
                        >
                          +{guild.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span style={{ 
                  display: "block",
                  marginTop: 12,
                  fontSize: "0.8rem",
                  color: "#d4af37"
                }}>
                  Enter Guild →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="wooden-table" style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 16 }}>
            Theme Packs
          </h2>
          <p style={{ color: "#c5baa8", lineHeight: 1.7 }}>
            Each guild supports custom visual themes inspired by different traditions and gaming universes.
            Available themes include: Dungeons & Dragons, World of Warcraft, Pathfinder, Elder Scrolls, 
            Norse, Egyptian, Celtic, Slavic, and Custom.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {["🎲 D&D", "⚔️ WoW", "🧭 Pathfinder", "🏔️ Elder Scrolls", "ᚱ Norse", "𓂀 Egyptian", "☘️ Celtic", "🌻 Slavic"].map((theme) => (
              <span 
                key={theme}
                style={{
                  padding: "6px 12px",
                  background: "rgba(212, 175, 55, 0.1)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  color: "#e8dcc8",
                }}
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="wooden-table" style={{ marginTop: 24 }}>
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

      <style>{`
        .guild-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15);
        }
      `}</style>
    </div>
  );
}
