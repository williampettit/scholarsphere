import Link from "next/link";

import { getSemesterStatus, pluralize } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CourseList } from "@/app/(app)/(authenticated)/(dashboard)/components/course-list";

async function getNextSemesterData() {
  const { userId } = await requireUser();

  const semesters = await prismaClient.semester.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      startDate: true,
    },
  });

  const sortedSemesters = semesters.sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
  });

  // find currently active semester
  const currentDate = new Date();
  let activeSemester = null;
  for (const semester of sortedSemesters) {
    if (semester.startDate > currentDate) {
      activeSemester = semester;
      break;
    }
  }

  // find semester after currently active one
  let nextSemester = null;
  for (const semester of sortedSemesters) {
    if (activeSemester && semester.startDate > activeSemester.startDate) {
      nextSemester = semester;
      break;
    }
  }

  if (!nextSemester) {
    return [];
  }

  const courses = await prismaClient.course.findMany({
    where: {
      userId,
      semesterId: nextSemester.id,
    },
    select: {
      id: true,
      name: true,
      color: true,
      shortId: true,
      description: true,
      creditHours: true,
      currentGrade: true,

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

  const coursesWithStatus = courses.map((course) => ({
    status: getSemesterStatus(course.semester),
    ...course,
  }));

  return coursesWithStatus;
}

export default async function NextSemesterTab() {
  const plannedCourses = await getNextSemesterData();

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          <Card className="col-span-2 lg:col-span-3">
            <div className="flex flex-row items-center justify-between px-6">
              <CardHeader className="px-0">
                <CardTitle>Planned Courses</CardTitle>
                <CardDescription>
                  {`${plannedCourses.length} planned ${pluralize(
                    plannedCourses.length,
                    "course",
                  )}`}
                </CardDescription>
              </CardHeader>

              <Link href="/courses/add" scroll={false}>
                <Button>Add</Button>
              </Link>
            </div>

            <Separator className="mb-6" />

            <CardContent>
              <CourseList courses={plannedCourses} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
