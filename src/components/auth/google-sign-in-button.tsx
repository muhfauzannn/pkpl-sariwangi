"use client";

import { useState, useTransition } from "react";
import { LoaderCircleIcon, LogInIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const defaultCallbackURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin + "/editor";
  }
  return (
    (process.env.NEXT_PUBLIC_APP_URL ?? "https://pkpl-sariwangi.vercel.app/") +
    "/editor"
  );
};

type GoogleSignInButtonProps = {
  callbackURL?: string;
  disabled?: boolean;
  label?: string;
};

export function GoogleSignInButton({
  callbackURL = defaultCallbackURL(),
  disabled = false,
  label = "Masuk dengan Google",
}: GoogleSignInButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (result.error) {
        setError("Login Google gagal. Periksa konfigurasi OAuth Anda.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button disabled={disabled || isPending} onClick={handleClick}>
        {isPending ? (
          <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
        ) : (
          <LogInIcon data-icon="inline-start" />
        )}
        {label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
