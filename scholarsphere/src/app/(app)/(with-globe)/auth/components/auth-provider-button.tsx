"use client";

import { signIn } from "next-auth/react";

import { siteMap } from "@/config/site-config";
import {
  AUTH_PROVIDER_DATA,
  FALLBACK_AUTH_PROVIDER_DATA,
} from "@/lib/auth-provider-data";

import { Button } from "@/components/ui/button";

type AuthProviderButtonProps = {
  providerId: string;
  providerName: string;
  postLoginRedirectUrl?: string;
};

export function AuthProviderButton({
  providerId,
  providerName,
  postLoginRedirectUrl,
}: AuthProviderButtonProps) {
  const { icon: AuthProviderIcon } =
    AUTH_PROVIDER_DATA.get(providerId) ?? FALLBACK_AUTH_PROVIDER_DATA;

  return (
    <>
      <Button
        className="gap-2"
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
