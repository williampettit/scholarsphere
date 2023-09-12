import { GPA } from "@/lib/gpa";
import { cn } from "@/lib/utils";
import { withinNDays } from "@/lib/utils";
import { type Course, CourseStatusEnum, type Semester } from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AssignmentList } from "@/app/(authenticated)/(dashboard)/components/assignment-list";
import { type AssignmentListItem } from "@/app/(authenticated)/(dashboard)/components/assignment-list";
import { CourseList } from "@/app/(authenticated)/(dashboard)/components/course-list";
import { AddAssignmentModal } from "@/app/(authenticated)/components/add-assignment-modal";
import { AddCourseModal } from "@/app/(authenticated)/components/add-course-modal";

type CourseWithStatus = Course & { status: CourseStatusEnum };

type DashboardStatsCardProps = {
  title: React.ReactNode;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
};

type DashboardStatsGpaCardProps = Pick<
  DashboardData,
  "completedGpa" | "tenativeGpa"
>;

type DashboardData = {
  tenativeGpa: GPA;
  completedGpa: GPA;

  allSemesters: Pick<Semester, "id" | "name" | "startDate">[];
  activeCourses: CourseWithStatus[];
  upcomingAssignments: AssignmentListItem[];

  numPlannedCourses: number;
  numSemesterCredits: number;
  numCompletedCredits: number;
  numCompletedCourses: number;
  numPlannedSemesters: number;
};

type DashboardDataReduce = DashboardData & {
  plannedSemesterIds: Semester["id"][];
};

type DashboardDataResponse =
  | {
      success: true;
      data: DashboardData;
    }
  | {
      success: false;
      error?: string;
    };

async function getDashboardData(): Promise<DashboardDataResponse> {
  // throw new Error("[THROW] testing error handling on dashboard page");

  const { userId } = await requireUser();

  // get all courses and semesters for user
  const { courses, semesters } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      semesters: true,
      courses: {
        include: {
          assignments: true,
        },
      },
    },
  });

  // map semesters to include status
  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const reducedData = courses.reduce<DashboardDataReduce>(
    (acc, courseEntry) => {
      const courseStatus =
        semestersWithStatus.find(
          (semester) => semester.id === courseEntry.semesterId,
        )?.status ?? CourseStatusEnum.NOT_PLANNED;

      switch (courseStatus) {
        // count completed courses and credits
        case CourseStatusEnum.COMPLETED: {
          acc.completedGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.numCompletedCredits += courseEntry.creditHours;
          acc.numCompletedCourses += 1;
          break;
        }

        // count active courses, credits, and upcoming assignments
        case CourseStatusEnum.IN_PROGRESS: {
          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.numSemesterCredits += courseEntry.creditHours;
          acc.activeCourses.push({
            ...courseEntry,
            status: courseStatus,
          });
          courseEntry.assignments.reduce((acc, assignment) => {
            if (
              assignment.dueDate &&
              !assignment.isComplete &&
              withinNDays(assignment.dueDate)
            ) {
              acc.upcomingAssignments.push({
                ...assignment,
                courseTitle: courseEntry.name,
                courseColor: courseEntry.color,
              });
            }
            return acc;
          }, acc);
          break;
        }

        // count planned courses
        case CourseStatusEnum.PLANNED: {
          if (courseEntry.semesterId) {
            acc.numPlannedCourses += 1;
            if (!acc.plannedSemesterIds.includes(courseEntry.semesterId)) {
              acc.plannedSemesterIds.push(courseEntry.semesterId);
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
      numSemesterCredits: 0,
      numCompletedCourses: 0,
      numCompletedCredits: 0,
      numPlannedSemesters: 0,
      activeCourses: [],
      plannedSemesterIds: [],
      upcomingAssignments: [],
      allSemesters: semesters.map((semester) => ({
        id: semester.id,
        name: semester.name,
        startDate: semester.startDate,
      })),
    },
  );

  const { plannedSemesterIds, ...otherReducedData } = reducedData;

  return {
    success: true,
    data: {
      ...otherReducedData,
      numPlannedSemesters: plannedSemesterIds.length,
    },
  };
}

function DashboardStatsCard({
  title,
  value,
  description,
  icon,
}: DashboardStatsCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </>
  );
}

function getGPADiffProps(gpaDiff: number) {
  if (gpaDiff === 0) {
    return { color: "text-muted-foreground", sign: "" };
  }

  if (gpaDiff > 0) {
    return { color: "text-green-500", sign: "+" };
  }

  return { color: "text-red-500", sign: "-" };
}

function DashboardStatsGpaCard({
  completedGpa,
  tenativeGpa,
}: DashboardStatsGpaCardProps) {
  const completedGpaValue = completedGpa.getGpa();
  const tenativeGpaValue = tenativeGpa.getGpa();
  const gpaDiff = tenativeGpaValue - completedGpaValue;

  const { color: gpaDiffColor, sign: gpaDiffSign } = getGPADiffProps(gpaDiff);

  return (
    <>
      <DashboardStatsCard
        title="GPA"
        value={completedGpaValue}
        description={
          <>
            <span className={gpaDiffColor}>{tenativeGpaValue}</span> after this
            semester (
            <span className={gpaDiffColor}>
              {`${gpaDiffSign}${gpaDiff.toFixed(2)}`}
            </span>
            )
          </>
        }
        icon={
          <Icons.gpa
            xmlns="http://www.w3.org/2000/svg"
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
    </>
  );
}

async function OverviewTab() {
  const dashboardDataResponse = await getDashboardData();

  if (!dashboardDataResponse.success) {
    throw new Error(dashboardDataResponse.error);
  }

  const { data: dashboardData } = dashboardDataResponse;

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <DashboardStatsGpaCard {...dashboardData} />

        <DashboardStatsCard
          title="Credits"
          value={dashboardData.completedGpa.getEarnedCredits()}
          description={`${dashboardData.tenativeGpa.getEarnedCredits()} after this semester`}
          icon={
            <Icons.credits
              xmlns="http://www.w3.org/2000/svg"
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
          value={dashboardData.numPlannedCourses}
          description={`across the next ${dashboardData.numPlannedSemesters} semesters`}
          icon={
            <Icons.planned
              xmlns="http://www.w3.org/2000/svg"
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
                {dashboardData.upcomingAssignments.length} upcoming assignments
                in the next 30 days
              </CardDescription>
            </CardHeader>

            <AddAssignmentModal activeCourses={dashboardData.activeCourses}>
              <Button>Add</Button>
            </AddAssignmentModal>
          </div>

          <Separator className="mb-6" />

          <CardContent>
            <AssignmentList assignments={dashboardData.upcomingAssignments} />
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <div className="flex flex-row items-center justify-between px-6">
            <CardHeader className="px-0">
              <CardTitle>Active Courses</CardTitle>
              <CardDescription>
                {dashboardData.activeCourses.length} active courses
              </CardDescription>
            </CardHeader>

            <AddCourseModal semesters={dashboardData.allSemesters}>
              <Button>Add</Button>
            </AddCourseModal>
          </div>

          <Separator className="mb-6" />

          <CardContent>
            <CourseList courses={dashboardData.activeCourses} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="next-semester">Next Semester</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="next-semester" className="space-y-4">
              TODO: Next semester view
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
