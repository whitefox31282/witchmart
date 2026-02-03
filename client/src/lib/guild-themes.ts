export type ThemeType = "dnd" | "wow" | "pathfinder" | "elderscrolls" | "norse" | "egyptian" | "celtic" | "slavic" | "custom";

export interface ThemePack {
  name: string;
  background: string;
  backgroundGradient: string;
  borderColor: string;
  borderStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: string;
  headerFont: string;
  decorativeElement: string;
  icon: string;
}

export const THEME_PACKS: Record<ThemeType, ThemePack> = {
  dnd: {
    name: "Dungeons & Dragons",
    background: "#2a1f14",
    backgroundGradient: "linear-gradient(135deg, #2a1f14 0%, #3d2914 50%, #1a1208 100%)",
    borderColor: "#8b4513",
    borderStyle: "4px solid",
    primaryColor: "#c9a227",
    secondaryColor: "#8b0000",
    accentColor: "#d4af37",
    textColor: "#f5e6d3",
    mutedTextColor: "#c4a77d",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "🎲",
    icon: "📜",
  },
  wow: {
    name: "World of Warcraft",
    background: "#1a1a2e",
    backgroundGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
    borderColor: "#4a4a6a",
    borderStyle: "3px ridge",
    primaryColor: "#ffd700",
    secondaryColor: "#00ced1",
    accentColor: "#9370db",
    textColor: "#e8e8f0",
    mutedTextColor: "#a8a8c0",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "⚔️",
    icon: "🛡️",
  },
  pathfinder: {
    name: "Pathfinder",
    background: "#1e2d24",
    backgroundGradient: "linear-gradient(135deg, #1e2d24 0%, #2a3d30 50%, #141f18 100%)",
    borderColor: "#6b8e23",
    borderStyle: "3px double",
    primaryColor: "#daa520",
    secondaryColor: "#228b22",
    accentColor: "#cd853f",
    textColor: "#f0e6d3",
    mutedTextColor: "#b8a888",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "🧭",
    icon: "📖",
  },
  elderscrolls: {
    name: "Elder Scrolls",
    background: "#1c1c28",
    backgroundGradient: "linear-gradient(135deg, #1c1c28 0%, #2a2a3a 50%, #141418 100%)",
    borderColor: "#5a5a7a",
    borderStyle: "3px inset",
    primaryColor: "#87ceeb",
    secondaryColor: "#4682b4",
    accentColor: "#708090",
    textColor: "#e0e8f0",
    mutedTextColor: "#9aa8b8",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "🏔️",
    icon: "⚡",
  },
  norse: {
    name: "Norse",
    background: "#1a1814",
    backgroundGradient: "linear-gradient(135deg, #1a1814 0%, #2d2820 50%, #121010 100%)",
    borderColor: "#5c4a32",
    borderStyle: "4px groove",
    primaryColor: "#d4af37",
    secondaryColor: "#8b4513",
    accentColor: "#cd7f32",
    textColor: "#e8dcc8",
    mutedTextColor: "#c5baa8",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "ᚱ",
    icon: "🦥",
  },
  egyptian: {
    name: "Egyptian",
    background: "#1a1508",
    backgroundGradient: "linear-gradient(135deg, #1a1508 0%, #2d2410 50%, #0f0d04 100%)",
    borderColor: "#d4af37",
    borderStyle: "3px solid",
    primaryColor: "#ffd700",
    secondaryColor: "#1a1a2e",
    accentColor: "#00ced1",
    textColor: "#f5e6c8",
    mutedTextColor: "#c9b896",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "𓂀",
    icon: "🏛️",
  },
  celtic: {
    name: "Celtic",
    background: "#0f1f14",
    backgroundGradient: "linear-gradient(135deg, #0f1f14 0%, #1a3020 50%, #081008 100%)",
    borderColor: "#2e8b57",
    borderStyle: "3px double",
    primaryColor: "#32cd32",
    secondaryColor: "#cd853f",
    accentColor: "#228b22",
    textColor: "#e8f0e8",
    mutedTextColor: "#a8c0a8",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "☘️",
    icon: "🌿",
  },
  slavic: {
    name: "Slavic",
    background: "#1a1418",
    backgroundGradient: "linear-gradient(135deg, #1a1418 0%, #2d2028 50%, #0f0a0d 100%)",
    borderColor: "#8b0000",
    borderStyle: "3px ridge",
    primaryColor: "#dc143c",
    secondaryColor: "#ffd700",
    accentColor: "#ff6347",
    textColor: "#f0e8e8",
    mutedTextColor: "#c0a8a8",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "🌻",
    icon: "🔥",
  },
  custom: {
    name: "Custom",
    background: "#1a1a1a",
    backgroundGradient: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #0f0f0f 100%)",
    borderColor: "#d4af37",
    borderStyle: "2px solid",
    primaryColor: "#d4af37",
    secondaryColor: "#5D3A8C",
    accentColor: "#E65100",
    textColor: "#e8dcc8",
    mutedTextColor: "#c5baa8",
    fontFamily: "'Merriweather', serif",
    headerFont: "'Cinzel', serif",
    decorativeElement: "✨",
    icon: "🦥",
  },
};

export function getTheme(themeType: ThemeType): ThemePack {
  return THEME_PACKS[themeType] || THEME_PACKS.norse;
}

export function getThemeStyles(theme: ThemePack) {
  return {
    container: {
      background: theme.backgroundGradient,
      borderLeft: `${theme.borderStyle} ${theme.borderColor}`,
      borderRight: `${theme.borderStyle} ${theme.borderColor}`,
    },
    card: {
      background: `${theme.background}dd`,
      border: `2px solid ${theme.borderColor}`,
      borderRadius: "8px",
    },
    header: {
      color: theme.primaryColor,
      fontFamily: theme.headerFont,
    },
    text: {
      color: theme.textColor,
      fontFamily: theme.fontFamily,
    },
    mutedText: {
      color: theme.mutedTextColor,
    },
    accent: {
      color: theme.accentColor,
    },
    button: {
      background: theme.primaryColor,
      color: theme.background,
      border: `2px solid ${theme.secondaryColor}`,
    },
  };
}
