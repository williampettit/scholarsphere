import Link from "next/link";

import { pluralize } from "@/lib/utils";

import {
  S_getRecentlyCompletedAssignments,
  S_getUpcomingAssignments,
} from "@/server/actions/get-assignments";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AssignmentList } from "@/app/(app)/(authenticated)/(dashboard)/components/assignment-list";

async function getAssignmentsPageData() {
  // TEMP: wait 10s
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  const upcomingAssignments = await S_getUpcomingAssignments();
  const recentlyCompletedAssignments =
    await S_getRecentlyCompletedAssignments();

  return {
    upcomingAssignments,
    recentlyCompletedAssignments,
  };
}

export default async function AssignmentsPage() {
  const { upcomingAssignments, recentlyCompletedAssignments } =
    await getAssignmentsPageData();

  const DATA = {
    upcoming: {
      label: "Upcoming Assignments",
      data: upcomingAssignments,
      singular: "upcoming assignment",
      plural: undefined,
      showAddButton: true,
    },
    recentlyCompleted: {
      label: "Recently Completed Assignments",
      data: recentlyCompletedAssignments,
      singular: "recently completed assignment",
      plural: undefined,
      showAddButton: false,
    },
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {Object.entries(DATA).map(
            ([key, { label, data, singular, plural, showAddButton }]) => (
              <Card key={key} className="col-span-2 lg:col-span-3">
                <div className="flex flex-row items-center justify-between px-6">
                  <CardHeader className="px-0">
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>
                      {`${data.length} ${pluralize(
                        data.length,
                        singular,
                        plural,
                      )}`}
                    </CardDescription>
                  </CardHeader>

                  {showAddButton ? (
                    <Link href="/assignments/add" scroll={false}>
                      <Button>Add</Button>
                    </Link>
                  ) : null}
                </div>

                <Separator className="mb-6" />

                <CardContent>
                  <AssignmentList assignments={data} />
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    </>
  );
}
