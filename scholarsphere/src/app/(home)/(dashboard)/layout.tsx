import { type RootLayoutProps } from "@/types/root-layout";
import { S_getUser } from "@/server/auth";
import { DashboardHeader } from "@/app/(home)/components/dashboard-header";

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await S_getUser();

  return (
    <>
      <DashboardHeader name={user.name} />
      {children}
    </>
  );
}
