import { type Metadata } from "next";

import { type LayoutProps } from "@/types/layout";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
