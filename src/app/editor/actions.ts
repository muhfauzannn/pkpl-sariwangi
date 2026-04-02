"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { isDatabaseConfigured } from "@/db";
import { canEditSite } from "@/lib/session";
import { saveSiteSettings } from "@/lib/site-settings";
import {
  colorPresetIds,
  defaultSiteTheme,
  fontPresetIds,
} from "@/lib/theme";

export type ThemeActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialThemeActionState: ThemeActionState = {
  status: "idle",
  message: "",
};

const updateThemeSchema = z.object({
  colorPreset: z.enum(colorPresetIds),
  fontPreset: z.enum(fontPresetIds),
});

export async function updateThemeAction(
  _previousState: ThemeActionState,
  formData: FormData
): Promise<ThemeActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email || !canEditSite(session.user.email)) {
    return {
      status: "error",
      message: "Akses edit hanya tersedia untuk email anggota kelompok.",
    };
  }

  const parsed = updateThemeSchema.safeParse({
    colorPreset: formData.get("colorPreset") ?? defaultSiteTheme.colorPreset,
    fontPreset: formData.get("fontPreset") ?? defaultSiteTheme.fontPreset,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Pilihan warna atau font tidak valid.",
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message:
        "DATABASE_URL belum diatur. Konfigurasikan database agar perubahan bisa disimpan.",
    };
  }

  try {
    await saveSiteSettings({
      ...parsed.data,
      updatedBy: session.user.email,
    });

    revalidatePath("/");
    revalidatePath("/editor");

    return {
      status: "success",
      message: "Tampilan website berhasil diperbarui.",
    };
  } catch {
    return {
      status: "error",
      message: "Penyimpanan gagal. Pastikan migrasi database sudah dijalankan.",
    };
  }
}
