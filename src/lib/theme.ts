export const colorPresets = [
  {
    id: "samudra",
    label: "Samudra",
    description: "Biru cerah dan energik.",
    primary: "#0066cc",
    secondary: "#00ccff",
    background: "#e6f2ff",
  },
  {
    id: "embun",
    label: "Embun",
    description: "Hijau segar dan natural.",
    primary: "#00a854",
    secondary: "#52c41a",
    background: "#f0f7e6",
  },
  {
    id: "pasir",
    label: "Pasir",
    description: "Oranye hangat dan ceria.",
    primary: "#ff8c00",
    secondary: "#ffa500",
    background: "#ffe8cc",
  },
  {
    id: "batu",
    label: "Batu",
    description: "Ungu modern dan elegan.",
    primary: "#722ed1",
    secondary: "#b37feb",
    background: "#f5e6ff",
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
