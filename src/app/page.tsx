import Link from "next/link";
import { PaletteIcon } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteIdentity } from "@/lib/group-data";
import { getSiteSettings } from "@/lib/site-settings";
import { canEditSite, getServerSession, isAuthConfigured } from "@/lib/session";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import { member, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await getServerSession();

  const [siteTheme, memberRecords, editorAccess] = await Promise.all([
    getSiteSettings(),
    db
      .select()
      .from(member)
      .leftJoin(user, eq(member.userId, user.id))
      .orderBy(member.createdAt),
    canEditSite(session?.user?.email),
  ]);

  const authConfigured = isAuthConfigured();

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="font-heading text-xl font-bold tracking-tight">
            {siteIdentity.teamName}
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                {editorAccess ? (
                  <Link
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "hidden sm:inline-flex",
                    )}
                    href="/editor"
                  >
                    <PaletteIcon data-icon="inline-start" />
                    Editor
                  </Link>
                ) : null}
                <SignOutButton />
              </>
            ) : (
              <div className="w-fit">
                <GoogleSignInButton
                  callbackURL="/editor"
                  disabled={!authConfigured}
                  label="Login"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden bg-background px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="max-w-4xl font-heading text-5xl font-semibold tracking-[-0.04em] text-foreground md:text-7xl">
                  {siteIdentity.teamName}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {siteIdentity.summary}
                </p>
              </div>
            </div>
          </div>
        </section>

        {!authConfigured ? (
          <section className="px-5 pb-8 md:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Alert>
                <AlertTitle>Setup diperlukan</AlertTitle>
                <AlertDescription>
                  Isi environment variable dan jalankan migrasi database.
                </AlertDescription>
              </Alert>
            </div>
          </section>
        ) : null}

        {memberRecords.length > 0 ? (
          <section className="bg-card px-5 py-20 md:px-8 md:py-24">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                  Anggota
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {memberRecords.map(({ member: m, user: u }) => {
                  const imageUrl = u?.image || m.image;
                  const initials = m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <Link key={m.id} href={`/member/${m.id}`}>
                      <Card className="h-full rounded-[28px] border border-border bg-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer">
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
                            <div className="flex flex-1 flex-col gap-1">
                              <CardTitle>{m.name}</CardTitle>
                              <CardDescription>{m.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {m.bio || "Tidak ada deskripsi"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <footer className="border-t border-border bg-background px-5 py-10 md:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="font-heading text-lg font-semibold">
              {siteIdentity.teamName}
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
