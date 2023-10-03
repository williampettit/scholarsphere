"use client";

import { signIn } from "next-auth/react";

import { siteMap } from "@/config/site-config";
import {
  AUTH_PROVIDER_METADATA_MAP,
  FALLBACK_AUTH_PROVIDER_METADATA,
} from "@/lib/auth-provider-metadata-map";

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
    AUTH_PROVIDER_METADATA_MAP.get(providerId) ?? FALLBACK_AUTH_PROVIDER_METADATA;

  function handleOnClick() {
    signIn(providerId, {
      callbackUrl: postLoginRedirectUrl ?? siteMap.dashboard.url,
    });
  }

  return (
    <Button
      className="gap-2"
      type="button"
      variant="outline"
      onClick={handleOnClick}
    >
      <AuthProviderIcon />

      {providerName}
    </Button>
  );
}
