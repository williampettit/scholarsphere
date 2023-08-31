import { type RootLayoutProps } from "@/types/root-layout";

import { S_requireUser } from "@/server/auth";

import { DashboardHeader } from "@/app/(home)/components/dashboard-header";

export default async function RootLayout({ children }: RootLayoutProps) {
  const { name } = await S_requireUser();

  return (
    <>
      <DashboardHeader name={name} />

      {children}
    </>
  );
}
