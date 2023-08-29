import { columns } from "@/app/(home)/courses/components/columns";
import { DataTable } from "@/app/(home)/courses/components/data-table";
import { S_getCourseTableData } from "@/server/actions/get-user-courses-data-for-table";

export default async function CoursesPage() {
  const courses = await S_getCourseTableData();
  return <DataTable data={courses ?? []} columns={columns} />;
}
