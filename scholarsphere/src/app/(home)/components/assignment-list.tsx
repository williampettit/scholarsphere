import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Assignment } from "@/types/database-types";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

export interface AssignmentListItem extends Assignment {
  courseTitle: string;
}

interface AssignmentListProps {
  assignments?: AssignmentListItem[];
}

function getDateColor(dueDate: Dayjs) {
  // (assignment overdue)
  if (dueDate.isBefore(dayjs())) {
    return "text-red-500";
  }

  // (assignment due in less than 24 hours)
  if (dueDate.isBefore(dayjs().add(24, "hour"))) {
    return "text-orange-500";
  }

  // (assignment due in less than 3 days)
  if (dueDate.isBefore(dayjs().add(3, "day"))) {
    return "text-yellow-500";
  }
}

export function AssignmentList({ assignments }: AssignmentListProps) {
  if (!assignments) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        Loading assignments...
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        No assignments
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {assignments
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
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
                  getDateColor(dayjs(assignment.dueDate))
                )}
              >
                {dayjs(assignment.dueDate).fromNow()}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
