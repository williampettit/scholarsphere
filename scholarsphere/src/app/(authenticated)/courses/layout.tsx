import { type Metadata } from "next";

import { type RootLayoutProps } from "@/types/root-layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesLayout({ children }: RootLayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Courses</PageHeaderTitle>
        <PageHeaderSubtitle>View all of your courses here.</PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
