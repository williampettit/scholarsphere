import dayjs from "dayjs";

import { cn, getAssignmentDueDateColor } from "@/lib/utils";
import { type Assignment } from "@/types/database-types";

export interface AssignmentListItem extends Assignment {
  courseTitle: string;
}

interface AssignmentListProps {
  assignments: AssignmentListItem[];
}

export function AssignmentList({ assignments }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
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
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
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
                  getAssignmentDueDateColor(assignment.dueDate),
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
