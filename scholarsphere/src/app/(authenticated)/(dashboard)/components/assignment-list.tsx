import {
  cn,
  formatAssignmentDueDate,
  getAssignmentDueDateColor,
} from "@/lib/utils";
import { type Assignment } from "@/types/shared";

import { AssignmentListItemDropdownMenu } from "@/app/(authenticated)/components/assignment-list-item-menu";
import { AssignmentDueDatePopover } from "@/app/(authenticated)/components/assignment-due-date-popover";
import { CourseNameWithDot } from "@/app/(authenticated)/components/course-name-with-dot";

export interface AssignmentListItem extends Assignment {
  courseTitle: string;
  courseColor: string | null;
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

                <CourseNameWithDot
                  className="text-sm text-muted-foreground"
                  courseId={assignment.courseId}
                  courseTitle={assignment.courseTitle}
                  courseColor={assignment.courseColor}
                />
              </div>

              <div className="ml-auto flex items-center space-x-2">
                <AssignmentDueDatePopover assignmentId={assignment.id}>
                  <span
                    className={cn(
                      "text-sm text-muted-foreground",
                      getAssignmentDueDateColor(assignment.dueDate),
                    )}
                  >
                    {formatAssignmentDueDate(assignment.dueDate)}
                  </span>
                </AssignmentDueDatePopover>

                <AssignmentListItemDropdownMenu />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
