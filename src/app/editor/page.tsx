import Link from "next/link";
import { MailIcon, ShieldCheckIcon, WandSparklesIcon } from "lucide-react";

import { ThemeEditor } from "@/components/editor/theme-editor";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getServerSession,
  canEditSite,
  isAuthConfigured,
} from "@/lib/session";
import { getSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

export default async function EditorPage() {
  const [session, siteTheme] = await Promise.all([
    getServerSession(),
    getSiteSettings(),
  ]);

  const editorAccess = canEditSite(session?.user?.email);
  const authConfigured = isAuthConfigured();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-5 py-6 md:px-8 md:py-8">
      <header className="flex flex-col gap-4 rounded-[28px] border border-border bg-card px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary">Area editor internal</Badge>
          <h1 className="font-heading text-3xl font-semibold">
            Kontrol tampilan website
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Hanya email anggota kelompok yang ada di `EDITOR_EMAILS` yang bisa
            menyimpan perubahan ke database.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            href="/"
          >
            Kembali ke beranda
          </Link>
          {session ? <SignOutButton /> : null}
        </div>
      </header>

      {!session ? (
        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Login Google diperlukan</CardTitle>
            <CardDescription>
              Halaman ini hanya dipakai untuk editor internal. Pengunjung umum
              cukup melihat halaman utama.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <GoogleSignInButton
              callbackURL="/editor"
              disabled={!authConfigured}
            />
            <p className="text-sm text-muted-foreground">
              Setelah login, email akan dicek terhadap daftar editor yang
              diizinkan.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {session && !editorAccess ? (
        <Alert>
          <MailIcon />
          <AlertTitle>Email ini belum masuk daftar editor</AlertTitle>
          <AlertDescription>
            Akun lain tetap bisa melihat website publik, tetapi perubahan tema
            dibatasi untuk anggota kelompok yang di-whitelist.
          </AlertDescription>
        </Alert>
      ) : null}

      {session && editorAccess ? (
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <ThemeEditor
            initialColorPreset={siteTheme.colorPreset}
            initialFontPreset={siteTheme.fontPreset}
          />

          <div className="flex flex-col gap-4">
            <Card className="rounded-[28px]">
              <CardHeader>
                <CardTitle>Akses aktif</CardTitle>
                <CardDescription>
                  Editor yang sedang login saat ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="font-medium">
                    {session.user.name ?? "Anggota kelompok"}
                  </p>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 text-muted-foreground">
                  <ShieldCheckIcon className="mt-0.5" />
                  <p>
                    Perubahan disimpan ke PostgreSQL melalui Drizzle dan akan
                    langsung dipakai halaman publik setelah submit berhasil.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px]">
              <CardHeader>
                <CardTitle>Catatan implementasi</CardTitle>
                <CardDescription>
                  Struktur akses yang dipakai di project ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                  <WandSparklesIcon className="mt-0.5" />
                  <p>
                    Hanya warna dan font yang diubah dari editor, sedangkan
                    konten biodata tetap tersedia publik di beranda.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="font-medium text-foreground">Current preset</p>
                  <p>Warna: {siteTheme.colorPreset}</p>
                  <p>Font: {siteTheme.fontPreset}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : null}
    </main>
  );
}
