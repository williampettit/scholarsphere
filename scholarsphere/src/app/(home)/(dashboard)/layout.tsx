import { redirect } from "next/navigation";
import { RootLayoutProps } from "@/types/root-layout";
import { siteConfig } from "@/config/site";
import { getServerSessionWrapper } from "@/server/auth";

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSessionWrapper();

  if (!session) {
    redirect(siteConfig.auth.login);
  }

  return <>{children}</>;
}
