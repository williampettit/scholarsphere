import { COURSE_STATUSES } from "@/lib/course-statuses";
import { entries, getSemesterStatus, groupBy, pluralize } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseCard } from "@/app/(app)/(authenticated)/courses/components/course-card";

async function getCoursesGroupedByStatus() {
  const { userId } = await requireUser();

  const courses = await prismaClient.course.findMany({
    where: {
      userId,
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
          endDate: true,
          startDate: true,
        },
      },
    },
  });

  const coursesWithStatusAdded = courses.map((course) => ({
    ...course,
    status: getSemesterStatus(course.semester),
  }));

  const coursesGroupedByStatus = groupBy(
    coursesWithStatusAdded,
    (course) => course.status,
  );

  return coursesGroupedByStatus;
}

export default async function CoursesPage() {
  const coursesGroupedByStatus = await getCoursesGroupedByStatus();

  return (
    <div className="flex flex-col space-y-6">
      {entries(coursesGroupedByStatus)
        .sort(
          ([statusA], [statusB]) =>
            COURSE_STATUSES[statusA].order - COURSE_STATUSES[statusB].order,
        )
        .map(([status, courses]) => {
          const { label: statusLabel } = COURSE_STATUSES[status];

          return (
            <Card key={status}>
              <CardHeader>
                <CardTitle>{statusLabel}</CardTitle>
                <CardDescription>
                  {`${courses.length} ${pluralize(courses.length, "course")}`}
                </CardDescription>
              </CardHeader>

              <CardContent
                className="
                  grid
                  grid-cols-1
                  gap-4
                  lg:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {courses.length === 0 ? (
                  <span className="text-muted-foreground">No courses</span>
                ) : (
                  courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
