import { type LayoutProps } from "@/types/layout";

import { requireUser } from "@/server/auth";

import { DashboardHeader } from "@/app/(app)/(authenticated)/(dashboard)/components/dashboard-header";
import { DashboardTabs } from "@/app/(app)/(authenticated)/(dashboard)/components/dashboard-tabs";

export default async function Layout({ children }: LayoutProps) {
  const { userDisplayName } = await requireUser();

  return (
    <>
      <DashboardHeader userDisplayName={userDisplayName} />

      <DashboardTabs />

      {children}
    </>
  );
}
