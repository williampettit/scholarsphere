import { redirect } from "next/navigation";

import { siteMap } from "@/lib/site-config";
import { type RootLayoutProps } from "@/types/root-layout";

import { getSession } from "@/server/auth";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function RootLayout({ children }: RootLayoutProps) {
  // (redirect if no session)
  const session = getSession();
  if (!session) {
    redirect(siteMap.login.url);
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        <div className="flex-1">
          <div className="container relative">
            <div className="space-y-6 p-8 pb-16">{children}</div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
