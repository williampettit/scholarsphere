import { Metadata } from "next";

import { columns } from "@/app/(authenticated)/courses/components/columns";
import { DataTable } from "@/app/(authenticated)/courses/components/data-table";
import { Separator } from "@/components/ui/separator";
import { mockGetCourseTableData } from "@/mock-data";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const courses = await mockGetCourseTableData();

  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
        <p className="text-muted-foreground">View all of your courses here.</p>
      </div>

      <Separator className="my-6" />

      <DataTable data={courses} columns={columns} />
    </>
  );
}
