import { type Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { type RootLayoutProps } from "@/types/root-layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "AI Chat",
};

export default async function AIChatLayout({ children }: RootLayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>AI Chat</PageHeaderTitle>

        <PageHeaderSubtitle>
          Here you can use the {siteConfig.name} AI Chat to interact with your
          data.
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
