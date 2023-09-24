import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getProviders } from "next-auth/react";

import { siteMap } from "@/config/site-config";

import { getSession } from "@/server/auth";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AuthHeaderText } from "@/app/(app)/(with-globe)/auth/components/auth-header-text";
import { AuthProviderButton } from "@/app/(app)/(with-globe)/auth/components/auth-provider-button";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: {
    callbackUrl?: string;
    error?: string;
  };
};

type AuthPageAlertProps = {
  errorDesc: string;
};

function AuthPageAlert({ errorDesc }: AuthPageAlertProps) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 flex items-end justify-center p-4 sm:items-start sm:justify-end">
        <div className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <Alert variant="destructive">
            <AlertTitle className="font-bold">Error</AlertTitle>

            <AlertDescription>{errorDesc}</AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // (redirect to dashboard if session exists)
  const session = await getSession();
  if (session) {
    redirect(siteMap.dashboard.url);
  }

  const providers = await getProviders();
  const { error, callbackUrl } = searchParams;

  return (
    <>
      {error ? <AuthPageAlert errorDesc={error} /> : null}

      <AuthHeaderText>Continue with</AuthHeaderText>

      <div className="grid gap-4">
        {providers
          ? Object.entries(providers).map(([providerId, providerData]) => (
              <AuthProviderButton
                key={providerId}
                providerId={providerId}
                providerName={providerData.name}
                postLoginRedirectUrl={callbackUrl}
              />
            ))
          : null}
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
