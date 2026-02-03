import { useState } from "react";
import { Link, useParams } from "wouter";
import { getGuildById, SAMPLE_MEMBERS } from "@/lib/guild-data";
import { getTheme, getThemeStyles, type ThemeType } from "@/lib/guild-themes";
import GuildListingCard from "@/components/guilds/GuildListingCard";

const GAME_CREATOR_TABS = [
  { id: "developers", name: "Developers", icon: "💻", description: "Game developers, programmers, and software engineers creating interactive experiences" },
  { id: "testers", name: "Testers", icon: "🔍", description: "Quality assurance specialists, bug hunters, and playtesters" },
  { id: "creators", name: "Creators", icon: "🎨", description: "Content creators, streamers, and gaming influencers" },
  { id: "modders", name: "Modders", icon: "🔧", description: "Modification creators, custom content makers, and game extenders" },
  { id: "artists", name: "Artists", icon: "🖼️", description: "2D/3D artists, animators, and visual designers for games" },
  { id: "sound-music", name: "Sound & Music", icon: "🎵", description: "Composers, sound designers, and audio engineers" },
  { id: "tools-engines", name: "Tools & Engines", icon: "⚙️", description: "Tool developers, engine creators, and development framework makers" },
];

export default function GameCreatorsGuild() {
  const params = useParams<{ tabId?: string }>();
  const activeTab = params.tabId || "developers";
  const [currentTheme] = useState<ThemeType>("dnd");

  const guild = getGuildById("game-creators");
  const theme = getTheme(currentTheme);
  const styles = getThemeStyles(theme);

  const currentTabInfo = GAME_CREATOR_TABS.find((t) => t.id === activeTab) || GAME_CREATOR_TABS[0];

  const filteredMembers = SAMPLE_MEMBERS.filter(
    (m) => m.guildId === "game-creators" && m.subcategoryId === activeTab
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.backgroundGradient,
        color: theme.textColor,
      }}
      data-testid="game-creators-guild-page"
    >
      <div className="max-w-6xl mx-auto p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          style={{ color: theme.primaryColor }}
          data-testid="back-to-makers"
        >
          ← Back to Village (Makers & Guilds Tent)
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontSize: "3rem" }}>🎮</span>
            <div>
              <h1
                style={{
                  ...styles.header,
                  fontSize: "2.5rem",
                  margin: 0,
                }}
              >
                Game Creators Guild
              </h1>
              <p style={{ ...styles.mutedText, margin: 0, marginTop: "8px" }}>
                {guild?.description}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: `${theme.background}aa`,
              borderRadius: "8px",
              border: `1px solid ${theme.borderColor}`,
              marginTop: "16px",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{theme.decorativeElement}</span>
            <span style={{ ...styles.accent }}>{theme.name} Theme</span>
          </div>
        </header>

        <nav className="mb-8">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              padding: "16px",
              background: `${theme.background}88`,
              borderRadius: "8px",
              border: `2px solid ${theme.borderColor}`,
            }}
          >
            {GAME_CREATOR_TABS.map((tab) => (
              <Link
                key={tab.id}
                href={`/guild/game-creators/${tab.id}`}
                data-testid={`tab-${tab.id}`}
              >
                <button
                  style={{
                    padding: "10px 18px",
                    borderRadius: "6px",
                    border: `2px solid ${activeTab === tab.id ? theme.primaryColor : theme.borderColor}`,
                    background: activeTab === tab.id ? theme.primaryColor : "transparent",
                    color: activeTab === tab.id ? theme.background : theme.textColor,
                    cursor: "pointer",
                    fontFamily: theme.fontFamily,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              </Link>
            ))}
          </div>
        </nav>

        <section>
          <div
            style={{
              ...styles.card,
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span style={{ fontSize: "2.5rem" }}>{currentTabInfo.icon}</span>
              <div>
                <h2 style={{ ...styles.header, fontSize: "1.75rem", margin: 0 }}>
                  {currentTabInfo.name}
                </h2>
                <p style={{ ...styles.mutedText, margin: 0, marginTop: "4px" }}>
                  {currentTabInfo.description}
                </p>
              </div>
            </div>
          </div>

          {filteredMembers.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {filteredMembers.map((member) => (
                <GuildListingCard
                  key={member.id}
                  displayName={member.displayName}
                  guildCategory="Game Creators Guild"
                  subcategory={currentTabInfo.name}
                  profileImage={member.profileImage}
                  symbol={member.symbol}
                  description={member.description}
                  theme={member.theme}
                  links={member.links}
                  onViewProfile={() => console.log("View profile:", member.id)}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                ...styles.card,
                padding: "40px",
                textAlign: "center",
              }}
            >
              <p style={{ ...styles.mutedText, fontSize: "1.1rem", marginBottom: "8px" }}>
                No entries found yet.
              </p>
              <p style={{ ...styles.mutedText }}>
                This part of the network is still being built.
              </p>
              <p
                style={{
                  ...styles.accent,
                  marginTop: "16px",
                  fontSize: "0.9rem",
                }}
              >
                Game creator registration coming in Phase 2
              </p>

              <div
                style={{
                  marginTop: "32px",
                  padding: "20px",
                  background: `${theme.primaryColor}11`,
                  borderRadius: "8px",
                  border: `1px dashed ${theme.borderColor}`,
                }}
              >
                <h3 style={{ ...styles.header, fontSize: "1.1rem", marginBottom: "12px" }}>
                  What {currentTabInfo.name} Do
                </h3>
                <p style={{ ...styles.text, lineHeight: 1.7 }}>
                  {currentTabInfo.description}. This section will feature guild members who specialize 
                  in this area, complete with their profiles, portfolios, and contact information.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer
          style={{
            marginTop: "48px",
            padding: "24px",
            background: `${theme.background}cc`,
            borderRadius: "8px",
            border: `1px solid ${theme.borderColor}`,
            textAlign: "center",
          }}
        >
          <p style={{ ...styles.mutedText, margin: 0 }}>
            Support: <span style={{ color: theme.accentColor }}>$RavensEvermore</span>
          </p>
          <p style={{ ...styles.mutedText, fontSize: "0.85rem", marginTop: "8px" }}>
            WitchMart does not provide legal, medical, or financial advice.
          </p>
        </footer>
      </div>
    </div>
  );
}
