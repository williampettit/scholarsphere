"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

interface AuthProviderButtonProps {
  providerId: string;
  providerName: string;
  callbackUrl?: string;
}

function AuthProviderIcon({
  providerId,
}: Pick<AuthProviderButtonProps, "providerId">) {
  switch (providerId) {
    case "github":
      return <Icons.gitHub className="mr-2 h-4 w-4" />;
    case "google":
      return <Icons.google className="mr-2 h-4 w-4" />;
    case "apple":
      return <Icons.apple className="mr-2 h-4 w-4" />;
  }
}

export function AuthProviderButton({
  providerId,
  providerName,
  callbackUrl,
}: AuthProviderButtonProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          signIn(providerId, {
            callbackUrl: callbackUrl ?? siteConfig.links.dashboard.href,
          })
        }
      >
        <AuthProviderIcon providerId={providerId} />
        {providerName}
      </Button>
    </>
  );
}
