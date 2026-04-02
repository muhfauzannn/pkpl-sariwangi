import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { siteSettings } from "@/db/schema";
import { defaultSiteTheme } from "@/lib/theme";

const SITE_SETTINGS_ID = "site";

export async function getSiteSettings() {
  if (!isDatabaseConfigured()) {
    return {
      ...defaultSiteTheme,
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
      return currentSettings;
    }

    await db.insert(siteSettings).values({
      id: SITE_SETTINGS_ID,
      ...defaultSiteTheme,
      updatedBy: "system",
    });

    return {
      id: SITE_SETTINGS_ID,
      ...defaultSiteTheme,
      updatedBy: "system",
      updatedAt: new Date(),
    };
  } catch {
    return {
      ...defaultSiteTheme,
      updatedAt: null,
      updatedBy: null,
    };
  }
}

export async function saveSiteSettings(input: {
  colorPreset: typeof defaultSiteTheme.colorPreset;
  fontPreset: typeof defaultSiteTheme.fontPreset;
  updatedBy: string;
}) {
  await db
    .insert(siteSettings)
    .values({
      id: SITE_SETTINGS_ID,
      colorPreset: input.colorPreset,
      fontPreset: input.fontPreset,
      updatedBy: input.updatedBy,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        colorPreset: input.colorPreset,
        fontPreset: input.fontPreset,
        updatedBy: input.updatedBy,
        updatedAt: new Date(),
      },
    });
}
