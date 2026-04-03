import Link from "next/link";
import { LockKeyholeIcon, MailIcon, UserRoundIcon } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeEditor } from "@/components/editor/theme-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteIdentity } from "@/lib/group-data";
import { canEditSite, getServerSession, isAuthConfigured } from "@/lib/session";
import { getSiteSettings } from "@/lib/site-settings";
import { getColorPresetMeta, getFontPresetMeta } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import { member, user } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export default async function EditorPage() {
  const session = await getServerSession();

  const [siteTheme, editorAccess, memberRecords] = await Promise.all([
    getSiteSettings(),
    canEditSite(session?.user?.email),
    db
      .select()
      .from(member)
      .leftJoin(
        user,
        or(eq(member.userId, user.id), eq(member.email, user.email)),
      )
      .orderBy(member.createdAt),
  ]);
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
              <Link href="/">Home</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:inline-flex",
              )}
              href="/"
            >
              Kembali
            </Link>
            {session ? <SignOutButton /> : null}
          </div>
        </div>
      </nav>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 pb-16 pt-28 md:px-8">
        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Kontrol tampilan website
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Hanya anggota yang login dengan email terdaftar yang bisa menyimpan
            perubahan.
          </p>
        </header>

        {!session ? (
          <Card className="max-w-xl rounded-[28px] border border-border bg-card">
            <CardHeader>
              <CardTitle>Login Google diperlukan</CardTitle>
              <CardDescription>Login untuk masuk ke editor.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <GoogleSignInButton
                disabled={!authConfigured}
                label="Login Google"
              />
              {!authConfigured ? (
                <p className="text-sm text-muted-foreground">
                  OAuth belum aktif. Lengkapi env terlebih dulu.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {session && !editorAccess ? (
          <div className="flex max-w-2xl flex-col gap-4">
            <Alert>
              <MailIcon />
              <AlertTitle>Akses editor ditolak</AlertTitle>
              <AlertDescription>
                Akun anda ({session.user.email}) tidak memiliki izin untuk
                mengedit situs.
              </AlertDescription>
            </Alert>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
              href="/"
            >
              Kembali ke halaman publik
            </Link>
          </div>
        ) : null}

        {session && editorAccess ? (
          <section className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside id="editor-panel" className="lg:sticky lg:top-28 lg:h-fit">
              <div className="flex flex-col gap-4">
                <ThemeEditor
                  initialColorPreset={siteTheme.colorPreset}
                  initialFontPreset={siteTheme.fontPreset}
                />
                <Card className="rounded-[28px] border border-border bg-card">
                  <CardHeader>
                    <CardTitle>Akun aktif</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-4">
                    <Avatar className="size-12 rounded-2xl">
                      <AvatarFallback className="rounded-2xl">
                        {session.user.name?.slice(0, 2).toUpperCase() ?? "ED"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">
                        {session.user.name ?? "Anggota kelompok"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            <section id="preview-panel" className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-[32px] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Preview
                    </p>
                    <h2 className="font-heading text-3xl font-semibold tracking-tight">
                      Direktori anggota
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{colorMeta.label}</Badge>
                    <Badge variant="secondary">{fontMeta.label}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {memberRecords.map(({ member: m, user: u }) => {
                  const imageUrl = u?.image;
                  const initials = m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <Card
                      className="rounded-[28px] border border-border bg-background shadow-sm"
                      key={m.id}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="size-16 rounded-2xl">
                            {imageUrl ? (
                              <img
                                alt={m.name}
                                src={imageUrl}
                                className="size-full object-cover rounded-2xl"
                              />
                            ) : (
                              <AvatarFallback className="rounded-2xl text-base bg-primary/20">
                                {initials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                <CardTitle>{m.name}</CardTitle>
                                <CardDescription>{m.role}</CardDescription>
                              </div>
                              <div className="rounded-xl border border-border bg-muted/40 p-2 text-muted-foreground">
                                <UserRoundIcon className="size-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="rounded-2xl border border-border bg-muted/30 p-4">
                          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {m.bio || "Tidak ada deskripsi"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </section>
        ) : null}
      </main>
    </>
  );
}
