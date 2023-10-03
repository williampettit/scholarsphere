import { type Metadata } from "next/types";

import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Assignments",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Assignments</PageHeaderTitle>

        <PageHeaderSubtitle>
          You can view and manage all of your assignments here.
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
