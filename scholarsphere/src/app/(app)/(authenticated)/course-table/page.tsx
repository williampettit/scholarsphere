import { z } from "zod";

import { getSemesterStatus } from "@/lib/utils";
import { courseTableEntrySchema } from "@/types/shared";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { columns } from "@/app/(app)/(authenticated)/course-table/components/columns";
import { DataTable } from "@/app/(app)/(authenticated)/course-table/components/data-table";

async function getCourseTableData() {
  const { userId } = await requireUser();

  const courses = await prismaClient.course.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      shortId: true,
      description: true,
      creditHours: true,
      currentGrade: true,
      color: true,
      semesterId: true,
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  const courseTableData = courses.map((course) => ({
    ...course,
    status: getSemesterStatus(course.semester),
  }));

  const parsedData = z.array(courseTableEntrySchema).safeParse(courseTableData);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  return parsedData.data;
}

export default async function CourseTablePage() {
  const courses = await getCourseTableData();

  return (
    <>
      <DataTable data={courses} columns={columns} />
    </>
  );
}
