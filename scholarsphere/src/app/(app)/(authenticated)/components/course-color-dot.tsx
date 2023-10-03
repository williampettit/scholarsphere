import { COURSE_COLOR_MAP } from "@/lib/course-color-map";
import { cn } from "@/lib/utils";
import { type CourseColor } from "@/types/shared";

type CourseColorDotProps = React.HTMLAttributes<HTMLSpanElement> & {
  color: CourseColor;
  className?: string;
};

export function CourseColorDot({
  color,
  className,
  ...props
}: CourseColorDotProps) {
  return (
    <span
      className={cn("flex h-2 w-2 rounded-full", className)}
      style={{ backgroundColor: COURSE_COLOR_MAP[color] }}
      {...props}
    />
  );
}
