import { type Metadata } from "next";

import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesLayout({ children }: LayoutProps) {
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
