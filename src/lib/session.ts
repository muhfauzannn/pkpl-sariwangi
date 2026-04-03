import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { allowedEmail } from "@/db/schema";

export async function canEditSite(email?: string | null) {
  if (!email) {
    return false;
  }

  try {
    const allowed = await db
      .select()
      .from(allowedEmail)
      .where(eq(allowedEmail.email, email.toLowerCase()))
      .limit(1);

    return allowed.length > 0;
  } catch {
    return false;
  }
}

export function isAuthConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_URL &&
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET,
  );
}

export async function getServerSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}
