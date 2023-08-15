import { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AssignmentList,
  AssignmentListItem,
} from "@/app/(dashboard)/dashboard/components/assignment-list";
import { Icons } from "@/components/icons";
import { CourseList } from "@/app/(dashboard)/dashboard/components/course-list";
import { ModeToggle } from "@/components/mode-toggle";
import { Assignment, Course, MOCK_DATA } from "@/mock-data";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardData {
  upcomingAssignments: AssignmentListItem[];
  activeCourses: Course[];
  numCompletedCourses: number;
  numCompletedCredits: number;
  numSemesterCredits: number;
  numPlannedCourses: number;
  numPlannedSemesters: number;
}

function mockGetDashboardData(): DashboardData {
  let dashboardData: DashboardData = {
    upcomingAssignments: [],
    activeCourses: [],
    numCompletedCourses: 0,
    numCompletedCredits: 0,
    numSemesterCredits: 0,
    numPlannedCourses: 0,
    numPlannedSemesters: 0,
  };

  dashboardData = MOCK_DATA.user.courses.reduce((acc, courseEntry) => {
    switch (courseEntry.status) {
      // Count completed courses and credits
      case "complete": {
        acc.numCompletedCredits += courseEntry.credits;
        acc.numCompletedCourses += 1;
        break;
      }
      
      // Count active courses, credits, and upcoming assignments
      case "active": {
        acc.numSemesterCredits += courseEntry.credits;
        acc.activeCourses.push(courseEntry);
        courseEntry.assignments.reduce((acc, assignment) => {
          if (
            assignment.dueDate &&
            !dayjs().isBefore(assignment.dueDate, "month")
          ) {
            acc.upcomingAssignments.push({
              ...assignment,
              courseTitle: courseEntry.title,
            });
          }
          return acc;
        }, acc);
        break;
      }

      // Count planned courses
      case "planned": {
        if (courseEntry.semesterId) {
          acc.numPlannedCourses += 1;
        }
        break;
      }
    }
    return acc;
  }, dashboardData);

  return dashboardData;
}

export default function DashboardPage() {
  const dashboardData = mockGetDashboardData();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  })();

  return (
    <>
      <PageHeader className="page-header">
        <Link
          href="/changelog"
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 mb-2 text-sm font-medium"
        >
          👋 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
          <span className="inline">
            Check out the changelog for the latest updates
          </span>
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
        <PageHeaderHeading className="hidden md:block">
          {greeting}, {MOCK_DATA.user.firstName}
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Examples</PageHeaderHeading>
        <PageHeaderDescription>
          Welcome to your dashboard. Here you can view your upcoming assignments
          in your active courses.
        </PageHeaderDescription>
      </PageHeader>

      <Separator className="my-6" />

      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="next-semester">Next Semester</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Credits
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.numCompletedCredits}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.numCompletedCredits +
                        dashboardData.numSemesterCredits}{" "}
                      after this semester
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">GPA</CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.65</div>
                    <p className="text-xs text-muted-foreground">
                      3.70 after this semester
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Planned Courses
                    </CardTitle>
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
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.numPlannedCourses}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      across the next {dashboardData.numPlannedSemesters}{" "}
                      semesters
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 lg:col-span-2">
                  <div className="flex flex-row items-center justify-between px-6">
                    <CardHeader className="px-0">
                      <CardTitle>Upcoming Assignments</CardTitle>
                      <CardDescription>
                        You have {dashboardData.upcomingAssignments.length}{" "}
                        upcoming assignments in the next 30 days.
                      </CardDescription>
                    </CardHeader>
                    <Button>Add</Button>
                  </div>

                  <Separator className="mb-6" />

                  <CardContent>
                    <AssignmentList
                      assignments={dashboardData.upcomingAssignments}
                    />
                  </CardContent>
                </Card>

                <Card className="col-span-2 lg:col-span-1">
                  <div className="flex flex-row items-center justify-between px-6">
                    <CardHeader className="px-0">
                      <CardTitle>Active Courses</CardTitle>
                      <CardDescription>
                        You have {dashboardData.activeCourses.length} active
                        courses.
                      </CardDescription>
                    </CardHeader>
                    <Button>Add</Button>
                  </div>

                  <Separator className="mb-6" />
                  
                  <CardContent>
                    <CourseList courses={dashboardData.activeCourses} />
                  </CardContent>
                </Card>
              </div>
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