import { cn } from "@/lib/utils";
import { type CourseStatusEnum } from "@/types/shared";
import { COURSE_STATUSES } from "@/lib/course-statuses";
import { Badge } from "@/components/ui/badge";

interface CourseStatusBadgeProps {
  status: CourseStatusEnum;
}

export function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  const { color, label } = COURSE_STATUSES[status];

  return (
    <>
      <Badge className={cn("text-xs text-white capitalize", color)}>
        {label}
      </Badge>
    </>
  );
}
