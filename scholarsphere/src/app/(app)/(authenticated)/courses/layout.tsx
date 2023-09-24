import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Courses</PageHeaderTitle>

        <PageHeaderSubtitle>
          You can view and manage all of your courses here.
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
