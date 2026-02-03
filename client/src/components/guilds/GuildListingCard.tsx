import { getTheme, getThemeStyles, type ThemeType } from "@/lib/guild-themes";

interface SocialLinks {
  discord?: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  website?: string;
  shop?: string;
  email?: string;
}

interface GuildListingCardProps {
  displayName: string;
  guildCategory: string;
  subcategory: string;
  profileImage?: string;
  symbol?: string;
  description: string;
  theme?: ThemeType;
  links: SocialLinks;
  onViewProfile?: () => void;
}

const SocialIcon = ({ type, url }: { type: string; url: string }) => {
  const icons: Record<string, { icon: string; label: string }> = {
    discord: { icon: "💬", label: "Discord" },
    youtube: { icon: "▶️", label: "YouTube" },
    tiktok: { icon: "🎵", label: "TikTok" },
    instagram: { icon: "📷", label: "Instagram" },
    website: { icon: "🌐", label: "Website" },
    shop: { icon: "🛒", label: "Shop" },
    email: { icon: "✉️", label: "Email" },
  };

  const { icon, label } = icons[type] || { icon: "🔗", label: "Link" };
  const href = type === "email" ? `mailto:${url}` : url;

  return (
    <a
      href={href}
      target={type === "email" ? undefined : "_blank"}
      rel="noopener noreferrer"
      title={label}
      data-testid={`social-link-${type}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        fontSize: "1.2rem",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.2)";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {icon}
    </a>
  );
};

export default function GuildListingCard({
  displayName,
  guildCategory,
  subcategory,
  profileImage,
  symbol,
  description,
  theme = "norse",
  links,
  onViewProfile,
}: GuildListingCardProps) {
  const themePack = getTheme(theme);
  const styles = getThemeStyles(themePack);

  const socialLinks = Object.entries(links).filter(([_, url]) => url);

  return (
    <div
      className="guild-listing-card"
      data-testid={`guild-card-${displayName.toLowerCase().replace(/\s+/g, "-")}`}
      style={{
        ...styles.card,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {profileImage ? (
          <img
            src={profileImage}
            alt={displayName}
            style={{
              width: 64,
              height: 64,
              borderRadius: "8px",
              objectFit: "cover",
              border: `2px solid ${themePack.borderColor}`,
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${themePack.primaryColor}22 0%, ${themePack.secondaryColor}22 100%)`,
              border: `2px solid ${themePack.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            {symbol || themePack.icon}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3
            style={{
              ...styles.header,
              margin: 0,
              fontSize: "1.25rem",
              marginBottom: "4px",
            }}
          >
            {displayName}
          </h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                ...styles.accent,
                fontSize: "0.8rem",
                padding: "2px 8px",
                background: `${themePack.primaryColor}22`,
                borderRadius: "4px",
              }}
            >
              {guildCategory}
            </span>
            <span
              style={{
                ...styles.mutedText,
                fontSize: "0.8rem",
                padding: "2px 8px",
                background: `${themePack.borderColor}33`,
                borderRadius: "4px",
              }}
            >
              {subcategory}
            </span>
          </div>
        </div>
      </div>

      <p style={{ ...styles.text, margin: 0, lineHeight: 1.6, fontSize: "0.95rem" }}>
        {description}
      </p>

      {socialLinks.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {socialLinks.map(([type, url]) => (
            <SocialIcon key={type} type={type} url={url!} />
          ))}
        </div>
      )}

      <button
        onClick={onViewProfile}
        data-testid="view-profile-button"
        style={{
          ...styles.button,
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          fontFamily: themePack.headerFont,
          fontSize: "0.9rem",
          fontWeight: 600,
          transition: "all 0.2s ease",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        View Full Profile
      </button>
    </div>
  );
}
