"use client";

import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  // Di browser, gunakan window.location.origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Server-side fallback
  return (
    process.env.NEXT_PUBLIC_APP_URL || "https://pkpl-sariwangi.vercel.app/"
  );
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});
