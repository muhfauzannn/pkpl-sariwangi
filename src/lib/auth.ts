import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "https://pkpl-sariwangi.vercel.app",
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
].filter((value): value is string => Boolean(value));

export const auth = betterAuth({
  appName: "PKPL Sariwangi",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://pkpl-sariwangi.vercel.app",
  secret:
    process.env.BETTER_AUTH_SECRET ?? "development-secret-development-secret",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
          },
        }
      : {},
  trustedOrigins,
  plugins: [nextCookies()],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 12,
  },
});
