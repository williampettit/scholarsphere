import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CourseCardSkeleton } from "@/app/(app)/(authenticated)/courses/components/course-card";

export default function LoadingCoursesPage() {
  const numCourseSkeletonsByStatus = {
    "In Progress": 5,
    "Planned": 4,
    "Completed": 20,
    "Not Planned": 8,
  };

  const COURSE_STATUS_ORDER = new Map<string, number>([
    ["In Progress", 0],
    ["Planned", 1],
    ["Completed", 2],
    ["Not Planned", 3],
  ]);

  return (
    <>
      <div className="flex flex-col space-y-6">
        {Object.entries(numCourseSkeletonsByStatus)
          .sort(([statusA], [statusB]) => {
            const statusAOrder =
              COURSE_STATUS_ORDER.get(statusA) ?? COURSE_STATUS_ORDER.size;
            const statusBOrder =
              COURSE_STATUS_ORDER.get(statusB) ?? COURSE_STATUS_ORDER.size;

            return statusAOrder - statusBOrder;
          })
          .map(([status, courses]) => {
            return (
              <Card key={status}>
                <CardHeader>
                  <CardTitle>{status}</CardTitle>
                  <CardDescription>Loading...</CardDescription>
                </CardHeader>

                <CardContent
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    md:grid-cols-3
                  "
                >
                  {courses === 0 ? (
                    <span className="text-muted-foreground">
                      No courses to show.
                    </span>
                  ) : (
                    <>
                      {Array.from({ length: courses }).map((_, i) => (
                        <CourseCardSkeleton key={i} />
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </>
  );
}
