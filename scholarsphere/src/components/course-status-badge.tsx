import { COURSE_STATUSES } from "@/lib/course-statuses";
import { cn } from "@/lib/utils";
import { type CourseStatusEnum } from "@/types/shared";

import { Badge } from "@/components/ui/badge";

type CourseStatusBadgeProps = {
  status: CourseStatusEnum;
  className?: string;
};

export function CourseStatusBadge({
  status,
  className,
}: CourseStatusBadgeProps) {
  const { color, label } = COURSE_STATUSES[status];

  return (
    <>
      <Badge
        variant="outline"
        className={cn("text-xs capitalize text-white", color, className)}
      >
        {label}
      </Badge>
    </>
  );
}
