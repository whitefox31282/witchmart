import type { ThemeType } from "./guild-themes";

export interface GuildSubcategory {
  id: string;
  name: string;
  icon: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: GuildSubcategory[];
  defaultTheme: ThemeType;
}

export interface GuildMember {
  id: string;
  displayName: string;
  guildId: string;
  subcategoryId: string;
  profileImage?: string;
  symbol?: string;
  description: string;
  theme: ThemeType;
  links: {
    discord?: string;
    youtube?: string;
    tiktok?: string;
    instagram?: string;
    website?: string;
    shop?: string;
    email?: string;
  };
}

export const GUILDS: Guild[] = [
  {
    id: "game-creators",
    name: "Game Creators Guild",
    icon: "🎮",
    description: "Digital realms, tabletop adventures, game development, and creative gaming communities",
    defaultTheme: "dnd",
    subcategories: [
      { id: "developers", name: "Developers", icon: "💻" },
      { id: "testers", name: "Testers", icon: "🔍" },
      { id: "creators", name: "Creators", icon: "🎨" },
      { id: "modders", name: "Modders", icon: "🔧" },
      { id: "artists", name: "Artists", icon: "🖼️" },
      { id: "sound-music", name: "Sound & Music", icon: "🎵" },
      { id: "tools-engines", name: "Tools & Engines", icon: "⚙️" },
    ],
  },
  {
    id: "artisans",
    name: "Artisans Guild",
    icon: "🏺",
    description: "Master craftspeople creating handmade goods with traditional techniques",
    defaultTheme: "norse",
    subcategories: [
      { id: "leatherwork", name: "Leatherwork", icon: "🛡️" },
      { id: "woodcraft", name: "Woodcraft", icon: "🪵" },
      { id: "metalwork", name: "Metalwork", icon: "⚒️" },
      { id: "pottery-ceramics", name: "Pottery & Ceramics", icon: "🏺" },
      { id: "textiles-weaving", name: "Textiles & Weaving", icon: "🧵" },
      { id: "jewelry", name: "Jewelry", icon: "💍" },
      { id: "bone-antler", name: "Bone & Antler Craft", icon: "🦴" },
      { id: "rune-carving", name: "Rune Carving", icon: "ᚱ" },
    ],
  },
  {
    id: "herbalists",
    name: "Herbalists & Apothecaries Guild",
    icon: "🌿",
    description: "Practitioners of herbal medicine, botanical arts, and natural remedies",
    defaultTheme: "celtic",
    subcategories: [
      { id: "herbal-remedies", name: "Herbal Remedies", icon: "🌱" },
      { id: "teas-tinctures", name: "Teas & Tinctures", icon: "🍵" },
      { id: "salves-oils", name: "Salves & Oils", icon: "🧴" },
      { id: "incense-resins", name: "Incense & Resins", icon: "🪔" },
      { id: "foraged-goods", name: "Foraged Goods", icon: "🍄" },
      { id: "ritual-herbs", name: "Ritual Herbs", icon: "🌿" },
    ],
  },
  {
    id: "diviners",
    name: "Diviners & Seers Guild",
    icon: "🔮",
    description: "Readers, interpreters, and practitioners of the mystical arts",
    defaultTheme: "egyptian",
    subcategories: [
      { id: "tarot-oracle", name: "Tarot & Oracle Readers", icon: "🃏" },
      { id: "rune-readers", name: "Rune Readers", icon: "ᚱ" },
      { id: "mediumship", name: "Mediumship", icon: "👁️" },
      { id: "dream-interpretation", name: "Dream Interpretation", icon: "🌙" },
      { id: "energy-work", name: "Energy Work", icon: "✨" },
      { id: "astrology", name: "Astrology", icon: "⭐" },
    ],
  },
  {
    id: "smiths",
    name: "Smiths & Forgers Guild",
    icon: "⚔️",
    description: "Masters of fire and metal, forging tools, weapons, and works of art",
    defaultTheme: "norse",
    subcategories: [
      { id: "blacksmithing", name: "Blacksmithing", icon: "🔨" },
      { id: "blade-forging", name: "Blade Forging", icon: "⚔️" },
      { id: "toolmaking", name: "Toolmaking", icon: "🔧" },
      { id: "armor-craft", name: "Armor Craft", icon: "🛡️" },
      { id: "metal-casting", name: "Metal Casting", icon: "🔥" },
    ],
  },
  {
    id: "builders",
    name: "Builders & Makers Guild",
    icon: "🪚",
    description: "Constructors and creators of functional goods and structures",
    defaultTheme: "norse",
    subcategories: [
      { id: "furniture", name: "Furniture", icon: "🪑" },
      { id: "shelters-structures", name: "Shelters & Structures", icon: "🏠" },
      { id: "carved-goods", name: "Carved Goods", icon: "🪵" },
      { id: "household-tools", name: "Household Tools", icon: "🧹" },
      { id: "custom-builds", name: "Custom Builds", icon: "🔨" },
    ],
  },
  {
    id: "textile",
    name: "Textile & Fiber Guild",
    icon: "🧵",
    description: "Weavers, sewers, and fiber artists creating wearable and decorative pieces",
    defaultTheme: "slavic",
    subcategories: [
      { id: "sewing", name: "Sewing", icon: "🪡" },
      { id: "knitting-crochet", name: "Knitting & Crochet", icon: "🧶" },
      { id: "embroidery", name: "Embroidery", icon: "🪢" },
      { id: "cloaks-garments", name: "Cloaks & Garments", icon: "🧥" },
      { id: "quilts", name: "Quilts", icon: "🛏️" },
      { id: "ritual-clothing", name: "Ritual Clothing", icon: "👘" },
    ],
  },
  {
    id: "ritual",
    name: "Ritual & Sacred Craft Guild",
    icon: "🕯️",
    description: "Creators of sacred objects, ritual tools, and spiritual implements",
    defaultTheme: "egyptian",
    subcategories: [
      { id: "altars", name: "Altars", icon: "🪔" },
      { id: "wands-staves", name: "Wands & Staves", icon: "🪄" },
      { id: "chalices", name: "Chalices", icon: "🏆" },
      { id: "athames", name: "Athames", icon: "🗡️" },
      { id: "ritual-kits", name: "Ritual Kits", icon: "📦" },
      { id: "spell-jars", name: "Spell Jars", icon: "🫙" },
      { id: "sacred-art", name: "Sacred Art", icon: "🎨" },
    ],
  },
  {
    id: "digital",
    name: "Digital Makers Guild",
    icon: "💻",
    description: "Digital artists, designers, and creators of virtual tools and experiences",
    defaultTheme: "wow",
    subcategories: [
      { id: "digital-art", name: "Digital Art", icon: "🖼️" },
      { id: "logos-branding", name: "Logos & Branding", icon: "✏️" },
      { id: "websites", name: "Websites", icon: "🌐" },
      { id: "3d-printing", name: "3D Printing", icon: "🖨️" },
      { id: "virtual-ritual", name: "Virtual Ritual Tools", icon: "🔮" },
      { id: "music-soundscapes", name: "Music & Soundscapes", icon: "🎧" },
    ],
  },
  {
    id: "educators",
    name: "Educators & Skillmasters Guild",
    icon: "📚",
    description: "Teachers, mentors, and sharers of knowledge and traditional skills",
    defaultTheme: "pathfinder",
    subcategories: [
      { id: "craft-classes", name: "Craft Classes", icon: "🎨" },
      { id: "spiritual-classes", name: "Spiritual Classes", icon: "🕯️" },
      { id: "survival-skills", name: "Survival Skills", icon: "🏕️" },
      { id: "homesteading", name: "Homesteading", icon: "🏡" },
      { id: "fishing", name: "Fishing (Paul Yeto's classes)", icon: "🎣" },
      { id: "workshops-courses", name: "Workshops & Courses", icon: "📖" },
    ],
  },
];

export function getGuildById(id: string): Guild | undefined {
  return GUILDS.find(g => g.id === id);
}

export function getGuildSubcategory(guildId: string, subcategoryId: string): GuildSubcategory | undefined {
  const guild = getGuildById(guildId);
  return guild?.subcategories.find(s => s.id === subcategoryId);
}

export const SAMPLE_MEMBERS: GuildMember[] = [];
