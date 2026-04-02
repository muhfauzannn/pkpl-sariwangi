"use client";

import { useTransition } from "react";
import { LogOutIcon, LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
      router.push("/");
    });
  }

  return (
    <Button onClick={handleClick} variant="outline">
      {isPending ? (
        <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
      ) : (
        <LogOutIcon data-icon="inline-start" />
      )}
      Keluar
    </Button>
  );
}
