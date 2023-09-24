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

import { AssignmentListSkeleton } from "@/app/(app)/(authenticated)/(dashboard)/components/assignment-list";
import { CourseListSkeleton } from "@/app/(app)/(authenticated)/(dashboard)/components/course-list";
import {
  DashboardStatsCardSkeleton,
  DashboardStatsGpaCardSkeleton,
} from "@/app/(app)/(authenticated)/(dashboard)/components/dashboard-stats-card";

export default function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <DashboardStatsGpaCardSkeleton />

        <DashboardStatsCardSkeleton
          title="Credits"
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

        <DashboardStatsCardSkeleton
          title="Planned Courses"
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
                Loading upcoming assignments for the next 30 days...
              </CardDescription>
            </CardHeader>

            <Button disabled>Add</Button>
          </div>

          <Separator className="mb-6" />

          <CardContent>
            <AssignmentListSkeleton />
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <div className="flex flex-row items-center justify-between px-6">
            <CardHeader className="px-0">
              <CardTitle>Active Courses</CardTitle>

              <CardDescription>Loading active courses...</CardDescription>
            </CardHeader>

            <Button disabled>Add</Button>
          </div>

          <Separator className="mb-6" />

          <CardContent>
            <CourseListSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
