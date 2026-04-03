import Link from "next/link";
import { ArrowRightIcon, LockKeyholeIcon, PaletteIcon } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupMembers, siteIdentity, stackItems } from "@/lib/group-data";
import { getSiteSettings } from "@/lib/site-settings";
import { canEditSite, getServerSession, isAuthConfigured } from "@/lib/session";
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
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-8">
            <div className="font-heading text-xl font-bold tracking-tight">
              {siteIdentity.teamName}
            </div>
            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#anggota">Anggota</a>
              <a href="#akses">Akses</a>
              <a href="#tampilan">Tampilan</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                {editorAccess ? (
                  <Link
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "hidden md:inline-flex",
                    )}
                    href="/editor"
                  >
                    <PaletteIcon data-icon="inline-start" />
                    Edit mode
                  </Link>
                ) : (
                  <Badge variant="secondary" className="hidden md:inline-flex">
                    Viewer
                  </Badge>
                )}
                <SignOutButton />
              </>
            ) : (
              <div className="w-fit">
                <GoogleSignInButton
                  callbackURL="/editor"
                  disabled={!authConfigured}
                  label="Login Google"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden bg-background px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.7fr]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{siteIdentity.course}</Badge>
                <Badge variant="secondary">Publik</Badge>
                {editorAccess ? (
                  <Badge>Edit aktif</Badge>
                ) : session ? (
                  <Badge variant="secondary">Login viewer</Badge>
                ) : null}
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Biodata Kelompok
                </p>
                <h1 className="max-w-4xl font-heading text-5xl font-semibold tracking-[-0.04em] text-foreground md:text-7xl">
                  {siteIdentity.teamName}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {siteIdentity.summary}
                </p>
              </div>

              <div id="akses" className="flex flex-wrap gap-3">
                <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                  Publik bisa melihat tanpa login
                </div>
                <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                  Editor hanya untuk email anggota
                </div>
              </div>
            </div>

            <div
              id="tampilan"
              className="flex flex-col gap-4 rounded-[32px] border border-border bg-card p-6 shadow-sm"
            >
              <div className="rounded-[28px] border border-border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">Preset warna</p>
                <p className="mt-1 font-heading text-2xl font-semibold">
                  {colorMeta.label}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {colorMeta.description}
                </p>
              </div>
              <div className="rounded-[28px] border border-border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">Preset font</p>
                <p className="mt-1 font-heading text-2xl font-semibold">
                  {fontMeta.label}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {fontMeta.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {stackItems.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {!authConfigured ? (
          <section className="px-5 pb-8 md:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Alert>
                <LockKeyholeIcon />
                <AlertTitle>OAuth belum aktif</AlertTitle>
                <AlertDescription>
                  Isi env auth dan jalankan migrasi database.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        ) : null}

        <section id="anggota" className="bg-card px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Direktori
                </p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                  Anggota kelompok
                </h2>
              </div>
              {editorAccess ? (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "hidden md:inline-flex",
                  )}
                  href="/editor"
                >
                  <ArrowRightIcon data-icon="inline-start" />
                  Buka editor
                </Link>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {groupMembers.map((member) => (
                <Card
                  className="rounded-[28px] border border-border bg-background shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  key={member.name}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="size-16 rounded-2xl">
                        <AvatarFallback className="rounded-2xl text-base">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1">
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.focus}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-background px-5 py-10 md:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="font-heading text-lg font-semibold">
              {siteIdentity.teamName}
            </div>
            <p className="text-sm text-muted-foreground">
              Publik melihat biodata. Anggota mengubah warna dan font melalui
              login Google.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
