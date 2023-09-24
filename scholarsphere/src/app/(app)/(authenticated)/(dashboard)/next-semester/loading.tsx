import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CourseListSkeleton } from "@/app/(app)/(authenticated)/(dashboard)/components/course-list";

export default async function NextSemesterTabSkeleton() {
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          <Card className="col-span-2 lg:col-span-3">
            <div className="flex flex-row items-center justify-between px-6">
              <CardHeader className="px-0">
                <CardTitle>Planned Courses</CardTitle>

                <CardDescription>Loading planned courses...</CardDescription>
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
    </>
  );
}
