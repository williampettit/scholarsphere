import { S_getCourseTableData } from "@/server/actions/get-user-course-table-data";

import { columns } from "@/app/(home)/courses/components/columns";
import { DataTable } from "@/app/(home)/courses/components/data-table";

export default async function CoursesPage() {
  const courses = await S_getCourseTableData();

  if (!courses.success) {
    return <div>Error: {courses.error}</div>;
  }

  return <DataTable data={courses.data} columns={columns} />;
}
