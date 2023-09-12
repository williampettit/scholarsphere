import { type Metadata } from "next";

import { RootLayoutProps } from "@/types/root-layout";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: RootLayoutProps) {
  return <>{children}</>;
}
