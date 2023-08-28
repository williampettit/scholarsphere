import { cn, getGradeColor } from "@/lib/utils";
import { CourseHoverCard } from "@/components/course-hover-card";
import { Course } from "@/types/database-types";

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">
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
              className="flex space-x-2 justify-between"
            >
              <div className="space-y-1">
                <CourseHoverCard course={courseEntry}>
                  <p className="text-sm font-medium leading-none overflow-ellipsis">
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
                  getGradeColor(courseEntry.currentGrade)
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
