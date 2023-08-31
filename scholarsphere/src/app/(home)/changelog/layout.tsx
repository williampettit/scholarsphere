import { type Metadata } from "next";

import { type RootLayoutProps } from "@/types/root-layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Changelog",
};

export default async function ChangelogPageLayout({
  children,
}: RootLayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Changelog</PageHeaderTitle>

        <PageHeaderSubtitle>
          Check out the latest site improvements!
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
