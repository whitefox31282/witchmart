import { useState } from "react";
import { Link, useParams } from "wouter";
import { getGuildById, SAMPLE_MEMBERS } from "@/lib/guild-data";
import { getTheme, getThemeStyles, type ThemeType } from "@/lib/guild-themes";
import GuildListingCard from "@/components/guilds/GuildListingCard";

export default function GuildLanding() {
  const params = useParams<{ guildId: string }>();
  const guildId = params.guildId;
  const guild = getGuildById(guildId);
  
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(guild?.defaultTheme || "norse");

  if (!guild) {
    return (
      <div className="min-h-screen bg-[#1a1814] text-[#e8dcc8] p-8">
        <Link href="/makers" className="text-[#d4af37] hover:underline">
          ← Back to Makers & Guilds
        </Link>
        <h1 className="text-2xl mt-8">Guild not found</h1>
      </div>
    );
  }

  const theme = getTheme(currentTheme);
  const styles = getThemeStyles(theme);

  const filteredMembers = SAMPLE_MEMBERS.filter(
    (m) => m.guildId === guildId && (!activeSubcategory || m.subcategoryId === activeSubcategory)
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.backgroundGradient,
        color: theme.textColor,
      }}
      data-testid={`guild-page-${guildId}`}
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
            <span style={{ fontSize: "3rem" }}>{guild.icon}</span>
            <div>
              <h1
                style={{
                  ...styles.header,
                  fontSize: "2.5rem",
                  margin: 0,
                }}
              >
                {guild.name}
              </h1>
              <p style={{ ...styles.mutedText, margin: 0, marginTop: "8px" }}>
                {guild.description}
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
            <span style={{ ...styles.mutedText, fontSize: "0.9rem" }}>Theme:</span>
            <span style={{ fontSize: "1.2rem" }}>{theme.decorativeElement}</span>
            <span style={{ ...styles.accent }}>{theme.name}</span>
          </div>
        </header>

        <section className="mb-8">
          <h2
            style={{
              ...styles.header,
              fontSize: "1.5rem",
              marginBottom: "16px",
            }}
          >
            Subcategories
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setActiveSubcategory(null)}
              data-testid="filter-all"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: `2px solid ${theme.borderColor}`,
                background: !activeSubcategory ? theme.primaryColor : "transparent",
                color: !activeSubcategory ? theme.background : theme.textColor,
                cursor: "pointer",
                fontFamily: theme.fontFamily,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
            >
              All
            </button>
            {guild.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                data-testid={`filter-${sub.id}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: `2px solid ${theme.borderColor}`,
                  background: activeSubcategory === sub.id ? theme.primaryColor : "transparent",
                  color: activeSubcategory === sub.id ? theme.background : theme.textColor,
                  cursor: "pointer",
                  fontFamily: theme.fontFamily,
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{sub.icon}</span>
                {sub.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2
            style={{
              ...styles.header,
              fontSize: "1.5rem",
              marginBottom: "16px",
            }}
          >
            Guild Members
          </h2>

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
                  guildCategory={guild.name}
                  subcategory={
                    guild.subcategories.find((s) => s.id === member.subcategoryId)?.name || ""
                  }
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
                Guild registration coming in Phase 2
              </p>
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
