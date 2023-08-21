import { Metadata } from "next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AssignmentList,
  AssignmentListItem,
} from "@/app/(home)/(dashboard)/components/assignment-list";
import { Icons } from "@/components/icons";
import { CourseList } from "@/app/(home)/(dashboard)/components/course-list";
import Link from "next/link";
import { Course, Semester } from "@/types/database-types";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";
import { getServerSessionWrapper } from "@/server/auth";
import dayjs from "dayjs";
import { getUserData } from "./courses/page";
import { CourseStatusString } from "./courses/data/schema";
import { AddCourseForm } from "./components/add-course-form";

export const metadata: Metadata = {
  title: "Dashboard",
};

export interface DashboardData {
  name: string;
  upcomingAssignments: AssignmentListItem[];
  activeCourses: (Course & {
    status: CourseStatusString;
  })[];
  numCompletedCourses: number;
  numCompletedCredits: number;
  numSemesterCredits: number;
  numPlannedCourses: number;
  plannedSemesterIds: Semester["id"][];
}

function ChangelogLink() {
  return (
    <>
      <Link
        href="/changelog"
        className="inline-flex items-center rounded-lg bg-muted px-3 py-1 mb-2 text-sm font-medium text-accent-foreground/80"
      >
        👋 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
        <span className="inline">Check out the latest site improvements!</span>
        <ArrowRightIcon className="ml-1 h-4 w-4" />
      </Link>
    </>
  );
}

async function getDashboardData() {
  const session = await getServerSessionWrapper();

  const id = session?.user.id;

  if (!id) {
    throw new Error("User ID not found");
  }

  const userData = await getUserData();

  if (!userData) {
    throw new Error("User data not found");
  }

  return userData.courses.reduce<DashboardData>(
    (acc, courseEntry) => {
      const courseStatus = userData.semesters.find(
        (semester) => semester.id === courseEntry.semesterId
      )?.status;

      switch (courseStatus) {
        // count completed courses and credits
        case "COMPLETED": {
          acc.numCompletedCredits += courseEntry.creditHours;
          acc.numCompletedCourses += 1;
          break;
        }

        // Count active courses, credits, and upcoming assignments
        case "IN_PROGRESS": {
          acc.numSemesterCredits += courseEntry.creditHours;
          acc.activeCourses.push({
            ...courseEntry,
            status: courseStatus,
          });
          courseEntry.assignments.reduce((acc, assignment) => {
            if (
              assignment.dueDate &&
              !assignment.isComplete &&
              !dayjs().isBefore(assignment.dueDate, "month")
            ) {
              acc.upcomingAssignments.push({
                ...assignment,
                courseTitle: courseEntry.name,
              });
            }
            return acc;
          }, acc);
          break;
        }

        // Count planned courses
        case "PLANNED": {
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
      name: userData.name,
      upcomingAssignments: [],
      activeCourses: [],
      numCompletedCourses: 0,
      numCompletedCredits: 0,
      numSemesterCredits: 0,
      numPlannedCourses: 0,
      plannedSemesterIds: [],
    }
  );
}

function AddCourseModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add course
          </DialogTitle>

          <DialogDescription>
            Add a course to your account here.
          </DialogDescription>
        </DialogHeader>

        <AddCourseForm />
      </DialogContent>
    </Dialog>
  );
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour > 23 || hour < 5) {
      return "Good night";
    } else if (hour < 12) {
      return "Good morning";
    } else if (hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  })();

  return (
    <>
      <div className="space-y-2">
        <ChangelogLink />

        <PageHeader>
          <PageHeaderTitle>
            {greeting}, {dashboardData.name.split(" ")[0]}
          </PageHeaderTitle>
          <PageHeaderSubtitle>
            Welcome to your dashboard. Here you can view your upcoming
            assignments for your active courses.
          </PageHeaderSubtitle>
        </PageHeader>
      </div>

      <div className="flex-col flex">
        <div className="flex-1 space-y-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="next-semester">Next Semester</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 grid-cols-3">
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
                      across the next {dashboardData.plannedSemesterIds.length}{" "}
                      semesters
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2 lg:col-span-2">
                  <div className="flex flex-row items-center justify-between px-6">
                    <CardHeader className="px-0">
                      <CardTitle>Upcoming Assignments</CardTitle>
                      <CardDescription>
                        {dashboardData.upcomingAssignments.length} upcoming
                        assignments in the next 30 days
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
                        {dashboardData.activeCourses.length} active courses
                      </CardDescription>
                    </CardHeader>

                    <AddCourseModal>
                      <Button>Add</Button>
                    </AddCourseModal>
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
