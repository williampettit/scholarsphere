import { pluralize } from "@/lib/utils";
import { type CourseBasicInfo } from "@/types/shared";

import { CourseStatusBadge } from "@/components/course-status-badge";
import { Icons } from "@/components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type CourseHoverCardProps = {
  children: React.ReactNode;
  course: Pick<
    CourseBasicInfo,
    | "id"
    | "name"
    | "shortId"
    | "description"
    | "creditHours"
    | "currentGrade"
    | "status"
  >;
};

export function CourseHoverCard({ course, children }: CourseHoverCardProps) {
  const primaryTitle = course.shortId ?? course.name;
  const secondaryTitle = course.shortId ? course.name : null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex flex-col">
              <h4 className="line-clamp-1 overflow-ellipsis text-sm font-semibold">
                {primaryTitle}
              </h4>

              {secondaryTitle && (
                <h4 className="line-clamp-1 overflow-ellipsis text-sm">
                  {secondaryTitle}
                </h4>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {course.description ?? "No description"}
            </p>

            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center pt-2">
                <Icons.Credits className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {course.creditHours} {pluralize(course.creditHours, "credit")}
                </span>
              </div>

              <div className="flex items-center pt-2">
                <Icons.CourseGrade className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {course.currentGrade.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center pt-2">
                <CourseStatusBadge status={course.status} />
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
