import { Metadata } from "next";
import dayjs from "dayjs";
import { z } from "zod";
import { getServerSessionWrapper } from "@/server/auth";
import prisma from "@/server/prisma";
import { columns } from "@/app/(home)/(dashboard)/courses/components/columns";
import { DataTable } from "@/app/(home)/(dashboard)/courses/components/data-table";
import {
  CourseStatusString,
  courseTableEntrySchema,
} from "@/app/(home)/(dashboard)/courses/data/schema";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Courses",
};

export async function getUserData() {
  const session = await getServerSessionWrapper();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session?.user.id,
    },
    select: {
      courses: {
        include: {
          assignments: true,
        },
      },
      semesters: true,
    },
  });

  return {
    ...user,
    ...session.user,
    semesters: user.semesters.map((semester) => ({
      ...semester,
      status: ((): CourseStatusString => {
        if (dayjs().isAfter(semester.endDate)) {
          // end date is in the past
          return "COMPLETED";
        } else if (dayjs().isBefore(semester.startDate)) {
          // start date is in the future
          return "PLANNED";
        } else if (dayjs().isBefore(semester.endDate)) {
          // start date is in the past and end date is in the future
          return "IN_PROGRESS";
        } else {
          // start date is in the past and end date is in the past
          return "COMPLETED";
        }
      })(),
    })),
  };
}

export async function getCourseTableData() {
  const userData = await getUserData();

  if (!userData) {
    return null;
  }

  const courseTableData = userData.courses.map((course) => {
    const semester = userData.semesters.find(
      (semester) => semester.id === course.semesterId
    );

    return {
      ...course,
      semester: semester,
      status: semester?.status,
    };
  });

  return z.array(courseTableEntrySchema).parse(courseTableData);
}

export default async function CoursesPage() {
  const courses = await getCourseTableData();

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Courses</PageHeaderTitle>
        <PageHeaderSubtitle>View all of your courses here.</PageHeaderSubtitle>
      </PageHeader>

      <DataTable data={courses ?? []} columns={columns} />
    </>
  );
}
