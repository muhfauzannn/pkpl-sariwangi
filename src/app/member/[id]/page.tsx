import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { db } from "@/db";
import { member, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";
import { siteIdentity } from "@/lib/group-data";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const memberRecords = await db
    .select()
    .from(member)
    .leftJoin(user, eq(member.userId, user.id))
    .where(eq(member.id, id))
    .limit(1);

  if (memberRecords.length === 0) {
    notFound();
  }

  const { member: memberData, user: userData } = memberRecords[0];
  const imageUrl = userData?.image || memberData.image;

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2",
            )}
          >
            <ChevronLeftIcon className="size-4" />
            <span className="hidden sm:inline">{siteIdentity.teamName}</span>
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        <section className="px-5 py-10 md:px-8 md:py-16">
          <div className="mx-auto w-full max-w-2xl">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <Avatar className="size-32 rounded-3xl shrink-0">
                  {imageUrl ? (
                    <img
                      alt={memberData.name}
                      src={imageUrl}
                      className="size-full object-cover rounded-3xl"
                    />
                  ) : (
                    <AvatarFallback className="rounded-3xl text-2xl bg-primary/20">
                      {memberData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col gap-3">
                  <div>
                    <h1 className="font-heading text-4xl font-semibold tracking-tight">
                      {memberData.name}
                    </h1>
                    <p className="text-lg text-primary">{memberData.role}</p>
                  </div>
                  {memberData.email && (
                    <a
                      href={`mailto:${memberData.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {memberData.email}
                    </a>
                  )}
                </div>
              </div>

              {memberData.bio && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-heading text-xl font-semibold">
                    Biodata
                  </h2>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {memberData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

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
