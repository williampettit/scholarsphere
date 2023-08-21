import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/database-types";

export function CourseHoverCard({
  course,
  children,
}: {
  course: Omit<Course, "userId" | "semesterId">;
  children: React.ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold overflow-ellipsis line-clamp-1">
                {course.shortId}
              </h4>

              <h4 className="text-sm text-muted-foreground overflow-ellipsis line-clamp-1">
                {course.name}
              </h4>
            </div>

            <p className="text-sm">{course.description}</p>

            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center pt-2">
                <Icons.credits className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {course.creditHours} credits
                </span>
              </div>

              <div className="flex items-center pt-2">
                <Icons.grade className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {course.currentGrade.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center pt-2">
                <Badge className="text-xs bg-green-500 text-white capitalize">
                  {course.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
