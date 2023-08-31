"use client";

import { signIn } from "next-auth/react";

import { siteMap } from "@/config/site";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <>
      <Button
        type="button"
        variant="default"
        onClick={() =>
          signIn(undefined, { callbackUrl: siteMap.dashboard.url })
        }
      >
        Login
      </Button>
    </>
  );
}
