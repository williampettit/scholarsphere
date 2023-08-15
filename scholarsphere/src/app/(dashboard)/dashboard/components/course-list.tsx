import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Course } from "@/mock-data";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CourseList({ courses }: { courses: Course[] }) {
  function getGradeColor(grade: number): string {
    if (grade >= 90) {
      return "text-green-500";
    } else if (grade >= 80) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  }

  return (
    <>
      <div className="space-y-6">
        {courses
          .sort((a, b) => b.grade - a.grade)
          .map((courseEntry) => (
            <div className="flex items-center">
              <div className="space-y-1">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="text-sm font-medium leading-none">
                      {courseEntry.title}
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-row items-center gap-2">
                            <h4 className="text-sm font-semibold">
                              {courseEntry.title}
                            </h4>
                            <h4 className="text-sm text-muted-foreground">
                              {courseEntry.shortId}
                            </h4>
                          </div>
                          <Badge className="text-xs bg-green-500 text-white capitalize">
                            {courseEntry.status}
                          </Badge>
                        </div>

                        <p className="text-sm">{courseEntry.description}</p>

                        <div className="flex flex-row items-center gap-4">
                          <div className="flex items-center pt-2">
                            <Icons.credits className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                              {courseEntry.credits} credits
                            </span>
                          </div>

                          <div className="flex items-center pt-2">
                            <Icons.grade className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                              {courseEntry.grade.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <p className="text-sm text-muted-foreground">
                  {courseEntry.credits} credits
                </p>
              </div>
              <div
                className={cn(
                  "ml-auto font-medium text-green-500",
                  getGradeColor(courseEntry.grade)
                )}
              >
                {courseEntry.grade.toFixed(2)}%
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
