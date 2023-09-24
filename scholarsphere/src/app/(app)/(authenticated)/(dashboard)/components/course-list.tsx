import { cn, getGradeColor, pluralize } from "@/lib/utils";
import { type CourseBasicInfo } from "@/types/shared";

import { Skeleton } from "@/components/ui/skeleton";

import { CourseNameWithDot } from "@/app/(app)/(authenticated)/components/course-name-with-dot";

type CourseListProps = {
  courses: CourseBasicInfo[];
};

type CourseListItemProps = {
  course: CourseBasicInfo;
};

type CourseListSkeletonProps = {
  amount?: number;
};

export function CourseListSkeleton({ amount = 5 }: CourseListSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: amount }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

function CourseListItem({ course }: CourseListItemProps) {
  return (
    <div className="flex justify-between space-x-2">
      <div className="space-y-1">
        <CourseNameWithDot
          className="overflow-ellipsis text-sm font-medium leading-none"
          course={course}
        />

        {
          // <p className="overflow-ellipsis text-sm font-medium leading-none">
          //   {course.name}
          // </p>
        }

        <p className="text-sm text-muted-foreground">
          {course.creditHours} {pluralize(course.creditHours, "credit")}
        </p>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <span
          className={cn(
            "text-sm text-muted-foreground",
            getGradeColor(course.currentGrade),
          )}
        >
          {course.currentGrade.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No courses
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses
        .sort((a, b) => b.currentGrade - a.currentGrade)
        .map((course) => (
          <CourseListItem key={course.id} course={course} />
        ))}
    </div>
  );
}
