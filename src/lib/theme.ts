export const colorPresets = [
  {
    id: "samudra",
    label: "Samudra",
    description: "Biru lembut sebagai fokus utama dengan latar krem hangat.",
  },
  {
    id: "embun",
    label: "Embun",
    description: "Nuansa segar dengan hijau kebiruan yang lebih ringan.",
  },
  {
    id: "pasir",
    label: "Pasir",
    description: "Kesan hangat dan rapi untuk profil kelompok yang formal.",
  },
  {
    id: "batu",
    label: "Batu",
    description: "Aksen netral yang tetap memakai palet yang sama.",
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
