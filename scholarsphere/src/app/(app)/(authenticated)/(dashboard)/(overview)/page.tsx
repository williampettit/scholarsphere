import Link from "next/link";

import { GPA } from "@/lib/gpa";
import { getSemesterStatus, pluralize, withinNDays } from "@/lib/utils";
import {
  type CourseBasicInfo,
  CourseStatusEnum,
  type Semester,
} from "@/types/shared";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  AssignmentList,
  type AssignmentListItemProps,
} from "@/app/(app)/(authenticated)/(dashboard)/components/assignment-list";
import { CourseList } from "@/app/(app)/(authenticated)/(dashboard)/components/course-list";
import {
  DashboardStatsCard,
  DashboardStatsGpaCard,
} from "@/app/(app)/(authenticated)/(dashboard)/components/dashboard-stats-card";

type OverviewTabReduceData = {
  tenativeGpa: GPA;
  completedGpa: GPA;
  numPlannedCourses: number;
  activeCourses: CourseBasicInfo[];
  plannedSemesterIds: Semester["id"][];
  upcomingAssignments: AssignmentListItemProps[];
};

type OverviewTabData = Omit<OverviewTabReduceData, "plannedSemesterIds"> & {
  numPlannedSemesters: number;
};

async function getOverviewTabData(): Promise<OverviewTabData> {
  const { userId } = await requireUser();

  const { courses, semesters } = await prismaClient.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    select: {
      courses: {
        select: {
          id: true,
          name: true,
          color: true,
          shortId: true,
          semesterId: true,
          description: true,
          creditHours: true,
          currentGrade: true,

          assignments: {
            select: {
              id: true,
              title: true,
              dueDate: true,
              isComplete: true,
            },
          },
        },
      },

      semesters: {
        select: {
          id: true,
          name: true,
          endDate: true,
          startDate: true,
        },
      },
    },
  });

  const coursesWithSemesterAndStatus = courses.map((course) => {
    const semester =
      semesters.find((semester) => semester.id === course.semesterId) ?? null;

    return {
      status: getSemesterStatus(semester),
      semester,
      ...course,
    };
  });

  const reducedData =
    coursesWithSemesterAndStatus.reduce<OverviewTabReduceData>(
      (acc, course) => {
        switch (course.status) {
          // count completed courses and credits
          case CourseStatusEnum.COMPLETED: {
            acc.completedGpa.addCourse({
              grade: course.currentGrade,
              creditHours: course.creditHours,
            });

            acc.tenativeGpa.addCourse({
              grade: course.currentGrade,
              creditHours: course.creditHours,
            });

            break;
          }

          // count active courses, credits, and upcoming assignments
          case CourseStatusEnum.IN_PROGRESS: {
            acc.activeCourses.push(course);

            acc.tenativeGpa.addCourse({
              grade: course.currentGrade,
              creditHours: course.creditHours,
            });

            course.assignments.forEach((assignment) => {
              if (
                assignment.dueDate &&
                !assignment.isComplete &&
                withinNDays(assignment.dueDate)
              ) {
                acc.upcomingAssignments.push({
                  ...assignment,
                  course,
                });
              }
            });

            break;
          }

          // count planned courses
          case CourseStatusEnum.PLANNED: {
            if (course.semester) {
              acc.numPlannedCourses += 1;

              if (!acc.plannedSemesterIds.includes(course.semester.id)) {
                acc.plannedSemesterIds.push(course.semester.id);
              }
            }

            break;
          }
        }

        return acc;
      },
      {
        tenativeGpa: new GPA(),
        completedGpa: new GPA(),
        numPlannedCourses: 0,
        activeCourses: [],
        plannedSemesterIds: [],
        upcomingAssignments: [],
      },
    );

  const { plannedSemesterIds, ...otherReducedData } = reducedData;

  return {
    ...otherReducedData,
    numPlannedSemesters: plannedSemesterIds.length,
  };
}

export default async function OverviewTab() {
  const {
    tenativeGpa,
    completedGpa,
    numPlannedCourses,
    numPlannedSemesters,
    activeCourses,
    upcomingAssignments,
  } = await getOverviewTabData();

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DashboardStatsGpaCard
            completedGpa={completedGpa.getGpa()}
            tenativeGpa={tenativeGpa.getGpa()}
          />

          <DashboardStatsCard
            title="Credits"
            value={completedGpa.getEarnedCredits()}
            description={`${tenativeGpa.getEarnedCredits()} after this semester`}
            icon={
              <Icons.Credits
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              />
            }
          />

          <DashboardStatsCard
            title="Planned Courses"
            value={numPlannedCourses}
            description={`across the next ${numPlannedSemesters} ${pluralize(
              numPlannedSemesters,
              "semester",
            )}`}
            icon={
              <Icons.Planned
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              />
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          <Card className="col-span-2 lg:col-span-2">
            <div className="flex flex-row items-center justify-between px-6">
              <CardHeader className="px-0">
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>
                  {`${upcomingAssignments.length} upcoming ${pluralize(
                    upcomingAssignments.length,
                    "assignment",
                  )} in the next 30 days`}
                </CardDescription>
              </CardHeader>

              <Link href="/assignments/add" scroll={false}>
                <Button>Add</Button>
              </Link>
            </div>

            <Separator className="mb-6" />

            <CardContent>
              <AssignmentList assignments={upcomingAssignments} />
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-1">
            <div className="flex flex-row items-center justify-between px-6">
              <CardHeader className="px-0">
                <CardTitle>Active Courses</CardTitle>
                <CardDescription>
                  {`${activeCourses.length} active ${pluralize(
                    activeCourses.length,
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
              <CourseList courses={activeCourses} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
