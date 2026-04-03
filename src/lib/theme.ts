export const colorPresets = [
  {
    id: "samudra",
    label: "Samudra",
    description: "Biru cerah dan energik.",
    primary: "#0066cc",
    primaryForeground: "#ffffff",
    secondary: "#00ccff",
    secondaryForeground: "#000000",
    tertiary: "#0099ff",
    tertiaryForeground: "#ffffff",
    background: "#f0f7ff",
    foreground: "#0a1428",
    card: "#ffffff",
    cardForeground: "#0a1428",
    accent: "#3399ff",
    accentForeground: "#ffffff",
    muted: "#cce5ff",
    mutedForeground: "#333333",
    border: "#99ccff",
  },
  {
    id: "embun",
    label: "Embun",
    description: "Hijau segar dan natural.",
    primary: "#00a854",
    primaryForeground: "#ffffff",
    secondary: "#52c41a",
    secondaryForeground: "#000000",
    tertiary: "#31a060",
    tertiaryForeground: "#ffffff",
    background: "#f6ffed",
    foreground: "#0b2818",
    card: "#ffffff",
    cardForeground: "#0b2818",
    accent: "#73d13d",
    accentForeground: "#000000",
    muted: "#b7eb8f",
    mutedForeground: "#252f2e",
    border: "#95de64",
  },
  {
    id: "pasir",
    label: "Pasir",
    description: "Oranye hangat dan ceria.",
    primary: "#ff8c00",
    primaryForeground: "#ffffff",
    secondary: "#ffa500",
    secondaryForeground: "#000000",
    tertiary: "#ff7a45",
    tertiaryForeground: "#ffffff",
    background: "#fff7e6",
    foreground: "#331d00",
    card: "#fffaf0",
    cardForeground: "#331d00",
    accent: "#ffb84d",
    accentForeground: "#000000",
    muted: "#ffd699",
    mutedForeground: "#3d2514",
    border: "#ffcc99",
  },
  {
    id: "batu",
    label: "Batu",
    description: "Ungu modern dan elegan.",
    primary: "#722ed1",
    primaryForeground: "#ffffff",
    secondary: "#b37feb",
    secondaryForeground: "#000000",
    tertiary: "#9254de",
    tertiaryForeground: "#ffffff",
    background: "#f9f0ff",
    foreground: "#38096d",
    card: "#ffffff",
    cardForeground: "#38096d",
    accent: "#d3adf7",
    accentForeground: "#000000",
    muted: "#efdbff",
    mutedForeground: "#3c1d66",
    border: "#d8b4ff",
  },
] as const;

export const fontPresets = [
  {
    id: "geist",
    label: "Geist",
    description: "Modern, rapat, dan cocok untuk tampilan default.",
  },
  {
    id: "manrope",
    label: "Manrope",
    description: "Sans-serif tegas untuk hierarki informasi yang jelas.",
  },
  {
    id: "jakarta",
    label: "Plus Jakarta Sans",
    description: "Lebih ramah untuk biodata dan kartu anggota.",
  },
  {
    id: "lora",
    label: "Lora",
    description: "Sedikit lebih editorial untuk tampilan yang hangat.",
  },
] as const;

export type ColorPresetId = (typeof colorPresets)[number]["id"];
export type FontPresetId = (typeof fontPresets)[number]["id"];

export const colorPresetIds = colorPresets.map((preset) => preset.id) as [
  ColorPresetId,
  ...ColorPresetId[],
];

export const fontPresetIds = fontPresets.map((preset) => preset.id) as [
  FontPresetId,
  ...FontPresetId[],
];

export const defaultSiteTheme = {
  colorPreset: "samudra" as ColorPresetId,
  fontPreset: "geist" as FontPresetId,
};

export function getColorPresetMeta(id: string) {
  return colorPresets.find((preset) => preset.id === id) ?? colorPresets[0];
}

export function getFontPresetMeta(id: string) {
  return fontPresets.find((preset) => preset.id === id) ?? fontPresets[0];
}
