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

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${jakarta.variable} ${lora.variable} h-full antialiased`}
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
