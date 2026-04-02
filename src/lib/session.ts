import { headers } from "next/headers";

import { auth } from "@/lib/auth";

function parseEditorEmails() {
  return new Set(
    (process.env.EDITOR_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function canEditSite(email?: string | null) {
  if (!email) {
    return false;
  }

  return parseEditorEmails().has(email.toLowerCase());
}

export function isAuthConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
      process.env.BETTER_AUTH_SECRET &&
      process.env.BETTER_AUTH_URL &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
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
