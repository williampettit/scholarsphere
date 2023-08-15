import { Metadata } from "next";
import { RootLayoutProps } from "@/types/root-layout";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
