import { COURSE_STATUS_MAP } from "@/lib/course-status-map";
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
  const { classes: color, label } = COURSE_STATUS_MAP[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs capitalize text-white", color, className)}
    >
      {label}
    </Badge>
  );
}
