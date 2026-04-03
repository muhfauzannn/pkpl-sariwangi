import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { siteSettings } from "@/db/schema";
import {
  defaultSiteTheme,
  colorPresets,
  type ColorPresetId,
  type FontPresetId,
  getColorPresetMeta,
} from "@/lib/theme";

const SITE_SETTINGS_ID = "site";

export interface ColorPalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  tertiary: string;
  tertiaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export function getColorPaletteFromPreset(presetId: string): ColorPalette {
  const preset = getColorPresetMeta(presetId);
  return {
    primary: preset.primary,
    primaryForeground: preset.primaryForeground,
    secondary: preset.secondary,
    secondaryForeground: preset.secondaryForeground,
    tertiary: preset.tertiary,
    tertiaryForeground: preset.tertiaryForeground,
    background: preset.background,
    foreground: preset.foreground,
    card: preset.card,
    cardForeground: preset.cardForeground,
    accent: preset.accent,
    accentForeground: preset.accentForeground,
    muted: preset.muted,
    mutedForeground: preset.mutedForeground,
    border: preset.border,
  };
}

export async function getSiteSettings() {
  if (!isDatabaseConfigured()) {
    return {
      ...defaultSiteTheme,
      colors: getColorPaletteFromPreset(defaultSiteTheme.colorPreset),
      updatedAt: null,
      updatedBy: null,
    };
  }

  try {
    const [currentSettings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SITE_SETTINGS_ID))
      .limit(1);

    if (currentSettings) {
      return {
        ...currentSettings,
        colors:
          (currentSettings.colors as ColorPalette) ||
          getColorPaletteFromPreset(currentSettings.colorPreset),
      };
    }

    const defaultColors = getColorPaletteFromPreset(
      defaultSiteTheme.colorPreset,
    );
    await db.insert(siteSettings).values({
      id: SITE_SETTINGS_ID,
      ...defaultSiteTheme,
      colors: defaultColors,
      updatedBy: "system",
    });

    return {
      id: SITE_SETTINGS_ID,
      ...defaultSiteTheme,
      colors: defaultColors,
      updatedBy: "system",
      updatedAt: new Date(),
    };
  } catch {
    return {
      ...defaultSiteTheme,
      colors: getColorPaletteFromPreset(defaultSiteTheme.colorPreset),
      updatedAt: null,
      updatedBy: null,
    };
  }
}

export async function saveSiteSettings(input: {
  colorPreset: ColorPresetId;
  fontPreset: FontPresetId;
  updatedBy: string;
}) {
  const colors = getColorPaletteFromPreset(input.colorPreset);

  await db
    .insert(siteSettings)
    .values({
      id: SITE_SETTINGS_ID,
      colorPreset: input.colorPreset,
      fontPreset: input.fontPreset,
      colors,
      updatedBy: input.updatedBy,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        colorPreset: input.colorPreset,
        fontPreset: input.fontPreset,
        colors,
        updatedBy: input.updatedBy,
        updatedAt: new Date(),
      },
    });
}
