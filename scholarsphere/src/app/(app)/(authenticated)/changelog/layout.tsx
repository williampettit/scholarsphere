import { type Metadata } from "next";

import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Changelog",
};

export default function ChangelogPageLayout({ children }: LayoutProps) {
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
