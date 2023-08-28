import { Course } from "@/types/database-types";
import { Icons } from "@/components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CourseStatusBadge } from "@/components/course-status-badge";

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
              <h4 className="text-sm overflow-ellipsis line-clamp-1">
                {course.name}
              </h4>
            </div>

            <p className="text-sm text-muted-foreground">
              {course.description ?? "No description"}
            </p>

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
                  {course.currentGrade.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center pt-2">
                <CourseStatusBadge
                  status={course.status} 
                />
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
