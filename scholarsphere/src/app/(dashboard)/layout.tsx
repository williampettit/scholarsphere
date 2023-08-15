import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RootLayoutProps } from "@/types/root-layout";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <div className="container relative">{children}</div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
