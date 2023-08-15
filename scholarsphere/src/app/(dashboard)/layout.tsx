import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RootLayoutProps } from "@/types/root-layout";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <div className="container relative">
            <div className="space-y-6 p-10 pb-16">{children}</div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
