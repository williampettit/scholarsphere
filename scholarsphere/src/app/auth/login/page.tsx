import Link from "next/link";
import { getProviders } from "next-auth/react";
import { AuthProviderButton } from "@/components/auth-provider-button";
import { AuthPageHeader } from "@/app/auth/components/auth-page-header";
import { AuthPageErrorToast } from "../components/auth-page-error-toast";
import { redirect } from "next/navigation";
import { getServerSessionWrapper } from "@/server/auth";
import { siteConfig } from "@/config/site";

export default async function LoginPage(props: {
  params: {};
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}) {
  const session = await getServerSessionWrapper();
  if (session) {
    redirect(siteConfig.links.dashboard.href);
  }
  
  const providers = await getProviders();
  const { searchParams } = props;
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
              callbackUrl={callbackUrl}
            />
          ))}
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="#terms-TODO"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#privacy-TODO"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
