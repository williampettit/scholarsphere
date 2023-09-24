import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCoursePage() {
  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Assignments</CardTitle>

            <CardDescription>
              Add assignments using natural language here.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <div className="flex flex-row items-center space-x-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-36" />
            </div>

            <div className="flex flex-col space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Course Info</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Course Name</p>
                  <Skeleton className="h-8 w-48" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Short ID
                  </p>
                  <Skeleton className="h-8 w-24" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Credit Hours
                  </p>
                  <Skeleton className="h-8 w-16" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Current Grade
                  </p>
                  <Skeleton className="h-8 w-16" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Description
                  </p>
                  <Skeleton className="h-24 w-full" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Student</p>
                  <div className="flex flex-row items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-36" />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Semester Name</p>
                  <Skeleton className="h-8 w-32" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Semester Start Date
                  </p>
                  <Skeleton className="h-8 w-48" />
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Semester End Date
                  </p>
                  <Skeleton className="h-8 w-48" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
