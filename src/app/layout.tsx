import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Lora,
  Manrope,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { getSiteSettings } from "@/lib/site-settings";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kelompok Sariwangi",
  description: "Website biodata kelompok dengan login Google dan editor tema.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteTheme = await getSiteSettings();

  const colorStyle = {
    "--primary": siteTheme.colors.primary,
    "--primary-foreground": siteTheme.colors.primaryForeground,
    "--secondary": siteTheme.colors.secondary,
    "--secondary-foreground": siteTheme.colors.secondaryForeground,
    "--accent": siteTheme.colors.accent,
    "--accent-foreground": siteTheme.colors.accentForeground,
    "--background": siteTheme.colors.background,
    "--foreground": siteTheme.colors.foreground,
    "--card": siteTheme.colors.card,
    "--card-foreground": siteTheme.colors.cardForeground,
    "--muted": siteTheme.colors.muted,
    "--muted-foreground": siteTheme.colors.mutedForeground,
    "--border": siteTheme.colors.border,
    "--ring": siteTheme.colors.primary,
  } as React.CSSProperties;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${jakarta.variable} ${lora.variable} h-full antialiased`}
      style={colorStyle}
    >
      <body
        className="min-h-full"
        data-color-preset={siteTheme.colorPreset}
        data-font-preset={siteTheme.fontPreset}
      >
        {children}
      </body>
    </html>
  );
}
