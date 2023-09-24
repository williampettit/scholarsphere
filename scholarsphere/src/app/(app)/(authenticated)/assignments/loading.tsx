import { pluralize } from "@/lib/utils";

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

export default function LoadingAssignmentsPage() {
  const DATA = {
    upcoming: {
      label: "Upcoming Assignments",
      singular: "upcoming assignment",
      plural: undefined,
      showAddButton: true,
    },
    recentlyCompleted: {
      label: "Recently Completed Assignments",
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
            ([key, { label, singular, plural, showAddButton }]) => (
              <Card key={key} className="col-span-2 lg:col-span-3">
                <div className="flex flex-row items-center justify-between px-6">
                  <CardHeader className="px-0">
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>
                      {`Loading ${pluralize(0, singular, plural)}`}
                    </CardDescription>
                  </CardHeader>

                  {showAddButton ? <Button disabled>Add</Button> : null}
                </div>

                <Separator className="mb-6" />

                <CardContent>
                  <AssignmentListSkeleton />
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    </>
  );
}
