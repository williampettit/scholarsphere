import Link from "next/link";

import { cn } from "@/lib/utils";
import { type CourseBasicInfo } from "@/types/shared";

import { CourseHoverCard } from "@/components/course-hover-card";

import { CourseColorDot } from "@/app/(app)/(authenticated)/components/course-color-dot";

type CourseNameWithDotProps = {
  className?: string;
  course: React.ComponentProps<typeof CourseHoverCard>["course"] & {
    color: CourseBasicInfo["color"];
  };
};

export function CourseNameWithDot({
  className,
  course,
}: CourseNameWithDotProps) {
  return (
    <CourseHoverCard course={course}>
      <div className="flex flex-row items-center space-x-1.5">
        <CourseColorDot color={course.color} />

        <Link
          href={`/course/${course.id}`}
          scroll={false}
          className={cn("line-clamp-1 overflow-ellipsis", className)}
        >
          {course.name}
        </Link>
      </div>
    </CourseHoverCard>
  );
}
