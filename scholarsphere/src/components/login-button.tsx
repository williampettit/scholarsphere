"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function LoginButton() {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          signIn(undefined, { callbackUrl: siteConfig.links.dashboard.href })
        }
      >
        Login
      </Button>
    </>
  );
}
