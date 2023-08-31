import { cn } from "@/lib/utils";

import {
  type DashboardDataProps,
  S_getDashboardData,
} from "@/server/actions/get-user-dashboard-data";

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

import { AddAssignmentModal } from "@/app/(home)/components/add-assignment-modal";
import { AddCourseModal } from "@/app/(home)/components/add-course-modal";
import { AssignmentList } from "@/app/(home)/components/assignment-list";
import { CourseList } from "@/app/(home)/components/course-list";

interface DashboardStatsCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
}

interface DashboardStatsGpaCardProps
  extends Pick<DashboardDataProps, "completedGpa" | "tenativeGpa"> {
  // ...
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

function DashboardStatsGpaCard({
  completedGpa,
  tenativeGpa,
}: DashboardStatsGpaCardProps) {
  const completedGpaValue = completedGpa.getGpa();
  const tenativeGpaValue = tenativeGpa.getGpa();
  const gpaDiff = tenativeGpaValue - completedGpaValue;
  const { color: gpaDiffColor, sign: gpaDiffSign } =
    gpaDiff === 0
      ? { color: "text-muted-foreground", sign: "" }
      : gpaDiff > 0
      ? { color: "text-green-500", sign: "+" }
      : { color: "text-red-500", sign: "-" };

  return (
    <>
      <DashboardStatsCard
        title="GPA"
        value={completedGpaValue}
        description={
          <>
            <span className={cn("font-bold", gpaDiffColor)}>
              {tenativeGpaValue}
            </span>{" "}
            after this semester (
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
  const dashboardData = await S_getDashboardData();

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
