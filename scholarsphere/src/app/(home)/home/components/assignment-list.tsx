import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Assignment } from "@/data/mock-data";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

export interface AssignmentListItem extends Assignment {
  courseTitle: string;
}

export function AssignmentList({
  assignments,
}: {
  assignments: AssignmentListItem[];
}) {
  function getDateColor(dueDate: Dayjs) {
    // If the assignment is overdue, make the date red
    if (dueDate.isBefore(dayjs())) {
      return "text-red-500";
    }

    // If the assignment is due in less than 24 hours, make the date orange
    if (dueDate.isBefore(dayjs().add(24, "hour"))) {
      return "text-orange-500";
    }

    // If the assignment is due in less than 3 days, make the date light yellow
    if (dueDate.isBefore(dayjs().add(3, "day"))) {
      return "text-yellow-500";
    }

    // Otherwise, do not change the date color
    return "";
  }

  return (
    <>
      <div className="space-y-6">
        {assignments
          .sort(
            (a, b) =>
              new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          )
          .map((assignment) => (
            <div key={assignment.id} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {assignment.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {assignment.courseTitle}
                </p>
              </div>
              <div
                className={cn(
                  "ml-auto font-medium",
                  getDateColor(dayjs(assignment.due_date))
                )}
              >
                {dayjs(assignment.due_date).fromNow()}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
