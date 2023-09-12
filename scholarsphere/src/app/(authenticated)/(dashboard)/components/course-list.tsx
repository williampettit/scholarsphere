import { cn, getCourseGradeColor } from "@/lib/utils";
import { CourseStatusEnum } from "@/types/shared";

import { CourseHoverCard } from "@/components/course-hover-card";

import { CourseListItemDropdownMenu } from "@/app/(authenticated)/components/course-list-item-menu";
import { CourseNameWithDot } from "@/app/(authenticated)/components/course-name-with-dot";

interface CourseListProps {
  courses: {
    id: string;
    name: string;
    shortId: string | null;
    description: string | null;
    creditHours: number;
    currentGrade: number;
    color: string | null;
    status: CourseStatusEnum;
  }[];
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
    <>
      <div className="space-y-6">
        {courses
          .sort((a, b) => b.currentGrade - a.currentGrade)
          .map((courseEntry) => (
            <div
              key={courseEntry.id}
              className="flex justify-between space-x-2"
            >
              <div className="space-y-1">
                <CourseHoverCard course={courseEntry}>
                  <CourseNameWithDot
                    className="overflow-ellipsis text-sm font-medium leading-none"
                    courseId={courseEntry.id}
                    courseTitle={courseEntry.name}
                    courseColor={courseEntry.color}
                  />
                  {/* <p className="overflow-ellipsis text-sm font-medium leading-none">
                    {courseEntry.name}
                  </p> */}
                </CourseHoverCard>

                <p className="text-sm text-muted-foreground">
                  {courseEntry.creditHours} credits
                </p>
              </div>

              <div className="ml-auto flex items-center space-x-2">
                <span
                  className={cn(
                    "text-sm text-muted-foreground",
                    getCourseGradeColor(courseEntry.currentGrade),
                  )}
                >
                  {courseEntry.currentGrade.toFixed(1)}%
                </span>

                <CourseListItemDropdownMenu />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
