import Link from "next/link";
import { redirect } from "next/navigation";

import { getProviders } from "next-auth/react";

import { siteMap } from "@/config/site";

import { S_getSession } from "@/server/auth";

import { AuthProviderButton } from "@/components/auth-provider-button";

import { AuthPageErrorToast } from "@/app/auth/components/auth-page-error-toast";
import { AuthPageHeader } from "@/app/auth/components/auth-page-header";

interface LoginPageProps {
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await S_getSession();

  if (session) {
    redirect(siteMap.dashboard.url);
  }

  const providers = await getProviders();

  const { error, callbackUrl } = searchParams;

  return (
    <>
      {error && <AuthPageErrorToast errorDesc={error} />}

      <AuthPageHeader>Continue with</AuthPageHeader>

      <div className="grid gap-4">
        {providers &&
          Object.entries(providers).map(([providerId, providerData]) => (
            <AuthProviderButton
              key={providerId}
              providerId={providerId}
              providerName={providerData.name}
              postLoginRedirectUrl={callbackUrl}
            />
          ))}
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href={siteMap.terms.url}
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href={siteMap.privacy.url}
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
