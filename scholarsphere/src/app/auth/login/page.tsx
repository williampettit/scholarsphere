import Link from "next/link";
import { getProviders } from "next-auth/react";
import { AuthProviderButton } from "@/components/auth-provider-button";
import { AuthPageHeader } from "@/app/auth/components/auth-page-header";
import { AuthPageErrorToast } from "@/app/auth/components/auth-page-error-toast";
import { redirect } from "next/navigation";
import { S_getSession } from "@/server/auth";
import { siteConfig } from "@/config/site";

interface LoginPageProps {
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await S_getSession();
  if (session) {
    redirect(siteConfig.links.dashboard);
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
          href={siteConfig.links.terms}
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href={siteConfig.links.privacy}
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
