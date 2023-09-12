import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

interface CourseNameWithDotProps {
  className?: string;
  courseId: string;
  courseTitle: string;
  courseColor: string | null;
}

const COURSE_PRESET_COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

function formatColorClassName(
  color: string | null,
  fallbackColor: string = "bg-sky-500",
): string {
  // no color provided
  if (!color) {
    return fallbackColor;
  }

  // is preset color
  if (COURSE_PRESET_COLORS.includes(color)) {
    return `bg-${color}-500`;
  }

  // assume is hex code color
  return `bg-[#${color}]`;
}

function CourseColorDot({ color }: { color: string | null }) {
  return (
    <>
      <span
        className={cn("flex h-2 w-2 rounded-full", formatColorClassName(color))}
      />
    </>
  );
}

export function CourseNameWithDot({
  className,
  courseTitle,
  courseColor,
  courseId,
}: CourseNameWithDotProps) {
  return (
    <>
      <Link
        className="flex items-center space-x-2"
        href={`/course/${courseId}`}
      >
        <Popover>
          <PopoverTrigger>
            <CourseColorDot color={courseColor} />
          </PopoverTrigger>

          <PopoverContent>
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">{courseTitle}</p>
              <div className="flex items-center space-x-2">
                {COURSE_PRESET_COLORS.map((color) => (
                  <CourseColorDot key={color} color={color} />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <p className={className}>{courseTitle}</p>
      </Link>
    </>
  );
}
