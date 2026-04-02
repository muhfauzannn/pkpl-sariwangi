import Link from "next/link";
import {
  ArrowRightIcon,
  LockKeyholeIcon,
  PaletteIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  groupHighlights,
  groupMembers,
  siteIdentity,
  stackItems,
} from "@/lib/group-data";
import { getSiteSettings } from "@/lib/site-settings";
import {
  canEditSite,
  getServerSession,
  isAuthConfigured,
} from "@/lib/session";
import { getColorPresetMeta, getFontPresetMeta } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default async function Home() {
  const [session, siteTheme] = await Promise.all([
    getServerSession(),
    getSiteSettings(),
  ]);

  const editorAccess = canEditSite(session?.user?.email);
  const authConfigured = isAuthConfigured();
  const colorMeta = getColorPresetMeta(siteTheme.colorPreset);
  const fontMeta = getFontPresetMeta(siteTheme.fontPreset);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 md:px-8 md:py-8">
      <header className="rounded-[28px] border border-border bg-card px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{siteIdentity.course}</Badge>
              <Badge variant="secondary">{siteIdentity.semester}</Badge>
              <Badge variant="secondary">Publik tanpa login</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="max-w-3xl font-heading text-3xl leading-tight font-semibold md:text-5xl">
                {siteIdentity.teamName}
              </h1>
              <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
                {siteIdentity.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-72">
            {session ? (
              <Card className="border border-border bg-background/80" size="sm">
                <CardHeader>
                  <CardTitle className="text-sm">Status sesi</CardTitle>
                  <CardDescription>
                    Login sebagai {session.user.name ?? session.user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-3">
                  <Badge>{editorAccess ? "Editor internal" : "Mode viewer"}</Badge>
                  {editorAccess ? (
                    <Link
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "w-fit"
                      )}
                      href="/editor"
                    >
                      <PaletteIcon data-icon="inline-start" />
                      Buka editor
                    </Link>
                  ) : null}
                  <SignOutButton />
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border bg-background/80" size="sm">
                <CardHeader>
                  <CardTitle className="text-sm">Akses editor</CardTitle>
                  <CardDescription>
                    Login Google hanya dibutuhkan untuk anggota yang akan
                    mengubah tampilan website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GoogleSignInButton
                    callbackURL="/editor"
                    disabled={!authConfigured}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </header>

      {!authConfigured ? (
        <Alert>
          <ShieldCheckIcon />
          <AlertTitle>OAuth belum dikonfigurasi</AlertTitle>
          <AlertDescription>
            Isi `DATABASE_URL`, `BETTER_AUTH_*`, `GOOGLE_CLIENT_*`, dan
            `EDITOR_EMAILS`, lalu jalankan migrasi database agar login Google
            aktif.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Desain yang saya terapkan</CardTitle>
            <CardDescription>
              Seluruh tampilan memakai bentuk solid tanpa gradient dan fokus
              pada keterbacaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {groupHighlights.map((item) => (
              <div
                className="rounded-2xl border border-border bg-background/80 p-4"
                key={item.title}
              >
                <p className="font-medium">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Tampilan aktif</CardTitle>
            <CardDescription>
              Preset yang sedang dipakai halaman publik.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Preset warna</p>
              <p className="font-medium">{colorMeta.label}</p>
              <p className="text-sm text-muted-foreground">
                {colorMeta.description}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Preset font</p>
              <p className="font-medium">{fontMeta.label}</p>
              <p className="text-sm text-muted-foreground">
                {fontMeta.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Biodata anggota</CardTitle>
            <CardDescription>
              Ganti data ini di `src/lib/group-data.ts` dengan data asli
              kelompok Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {groupMembers.map((member) => (
              <Card className="border border-border bg-background/80" key={member.name} size="sm">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {member.focus}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[28px]">
          <CardHeader>
            <CardTitle>Stack dan alur akses</CardTitle>
            <CardDescription>
              Struktur website dipisah antara halaman publik dan editor
              internal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {stackItems.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <LockKeyholeIcon className="mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">
                    Pengunjung umum
                  </p>
                  <p>
                    Bisa membuka biodata kelompok tanpa login dan melihat tema
                    terbaru yang tersimpan.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4">
                <PaletteIcon className="mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">
                    Anggota kelompok
                  </p>
                  <p>
                    Login via Google, diverifikasi lewat `EDITOR_EMAILS`, lalu
                    bisa membuka halaman editor untuk mengubah warna dan font.
                  </p>
                </div>
              </div>
            </div>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
              href="/editor"
            >
              <ArrowRightIcon data-icon="inline-start" />
              Lihat halaman editor
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
