import { redirect } from "next/navigation";

import { siteMap } from "@/config/site-config";

import { type LayoutProps } from "@/types/layout";

import { getSession } from "@/server/auth";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type AuthenticatedLayoutProps = LayoutProps & {
  modal: React.ReactNode;
};

export default async function Layout({
  children,
  modal,
}: AuthenticatedLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect(siteMap.login.url);
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        <div className="flex-1">
          <div className="container">
            <div className="space-y-6 p-8 pb-16">{children}</div>
          </div>
        </div>

        <SiteFooter />
      </div>

      {modal}
    </>
  );
}
