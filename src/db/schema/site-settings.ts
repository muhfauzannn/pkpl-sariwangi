import { pgEnum, pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const colorPresetEnum = pgEnum("color_preset", [
  "samudra",
  "embun",
  "pasir",
  "batu",
]);

export const fontPresetEnum = pgEnum("font_preset", [
  "geist",
  "manrope",
  "jakarta",
  "lora",
]);

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("site"),
  colorPreset: colorPresetEnum("color_preset").notNull().default("samudra"),
  fontPreset: fontPresetEnum("font_preset").notNull().default("geist"),
  colors: jsonb("colors").notNull().default({}),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
