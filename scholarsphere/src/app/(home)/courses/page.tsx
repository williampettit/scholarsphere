import { Metadata } from "next";

import { columns } from "@/app/(home)/courses/components/columns";
import { DataTable } from "@/app/(home)/courses/components/data-table";
import { mockGetCourseTableData } from "@/data/mock-data";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const courses = await mockGetCourseTableData();

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Courses</PageHeaderTitle>
        <PageHeaderSubtitle>View all of your courses here.</PageHeaderSubtitle>
      </PageHeader>

      <DataTable data={courses} columns={columns} />
    </>
  );
}
