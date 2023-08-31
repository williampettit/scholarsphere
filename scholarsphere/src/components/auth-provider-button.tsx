"use client";

import { signIn } from "next-auth/react";

import { siteMap } from "@/config/site";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface AuthProviderButtonProps {
  providerId: string;
  providerName: string;
  postLoginRedirectUrl?: string;
}

const authProviderIcons = {
  github: () => <Icons.gitHub className="mr-2 h-4 w-4" />,
  google: () => <Icons.google className="mr-2 h-4 w-4" />,
  apple: () => <Icons.apple className="mr-2 h-4 w-4" />,
};

export function AuthProviderButton({
  providerId,
  providerName,
  postLoginRedirectUrl,
}: AuthProviderButtonProps) {
  const AuthProviderIcon = Object.entries(authProviderIcons).find(
    ([key]) => key === providerId,
  )![1];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          signIn(providerId, {
            callbackUrl: postLoginRedirectUrl ?? siteMap.dashboard.url,
          })
        }
      >
        <AuthProviderIcon />
        {providerName}
      </Button>
    </>
  );
}
