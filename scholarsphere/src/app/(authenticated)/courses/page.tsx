import { z } from "zod";

import {
  CourseStatusEnum,
  type CourseTableEntryType,
  courseTableEntrySchema,
} from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import { columns } from "@/app/(authenticated)/courses/components/columns";
import { DataTable } from "@/app/(authenticated)/courses/components/data-table";

type GetCourseTableDataResponse =
  | {
      success: true;
      data: CourseTableEntryType[];
    }
  | {
      success: false;
      error?: string;
    };

async function getCourseTableData(): Promise<GetCourseTableDataResponse> {
  const { userId } = await requireUser();

  const { semesters, courses } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      courses: {
        select: {
          id: true,
          name: true,
          shortId: true,
          description: true,
          creditHours: true,
          currentGrade: true,
          color: true,
          semesterId: true,
        },
      },
      semesters: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const courseTableData = courses.map((course) => {
    const semester = semestersWithStatus.find(
      (semester) => semester.id === course.semesterId,
    );

    return {
      ...course,
      semester: semester,
      status: semester?.status ?? CourseStatusEnum.NOT_PLANNED,
    };
  });

  const parsedData = z.array(courseTableEntrySchema).safeParse(courseTableData);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Failed to parse course table data",
    };
  }

  return {
    success: true,
    data: parsedData.data,
  };
}

export default async function CoursesPage() {
  const courses = await getCourseTableData();

  if (!courses.success) {
    return <div>Error: {courses.error}</div>;
  }

  return <DataTable data={courses.data} columns={columns} />;
}
