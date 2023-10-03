import { type Metadata } from "next/types";

import { type LayoutProps } from "@/types/layout";

export const metadata: Metadata = {
  title: "API Documentation",
};

export default function DocsLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
