import { cn, getCourseGradeColor } from "@/lib/utils";
import { Course } from "@/types/database-types";

import { CourseHoverCard } from "@/components/course-hover-card";

interface CourseListProps {
  courses: Course[];
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
                  <p className="overflow-ellipsis text-sm font-medium leading-none">
                    {courseEntry.name}
                  </p>
                </CourseHoverCard>

                <p className="text-sm text-muted-foreground">
                  {courseEntry.creditHours} credits
                </p>
              </div>

              <div
                className={cn(
                  "ml-auto font-medium",
                  getCourseGradeColor(courseEntry.currentGrade),
                )}
              >
                {courseEntry.currentGrade.toFixed(1)}%
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
