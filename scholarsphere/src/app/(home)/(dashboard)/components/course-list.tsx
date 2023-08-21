import { cn } from "@/lib/utils";
import { CourseHoverCard } from "@/components/course-hover-card";
import { Course } from "@/types/database-types";

export function CourseList({
  courses,
}: {
  courses: Course[];
}) {
  function getGradeColor(grade: number): string {
    if (grade >= 90) {
      return "text-green-500";
    } else if (grade >= 80) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
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
                  "ml-auto font-medium text-green-500",
                  getGradeColor(courseEntry.currentGrade)
                )}
              >
                {courseEntry.currentGrade.toFixed(2)}%
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
