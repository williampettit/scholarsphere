import { type RootLayoutProps } from "@/types/root-layout";

import { requireUser } from "@/server/auth";

import { DashboardHeader } from "@/app/(authenticated)/(dashboard)/components/dashboard-header";

export default async function RootLayout({ children }: RootLayoutProps) {
  const { userDisplayName } = await requireUser();

  return (
    <>
      <DashboardHeader
        userDisplayName={userDisplayName}
      />

      {children}
    </>
  );
}
