import Link from "next/link";

import { cn, formatDueDate, getRelativeDateColor } from "@/lib/utils";
import { type AssignmentBasicInfo, type CourseBasicInfo } from "@/types/shared";

import { AssignmentMenu } from "@/components/menus/assignment-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { CourseNameWithDot } from "@/app/(app)/(authenticated)/components/course-name-with-dot";

export type AssignmentListItemProps = AssignmentBasicInfo & {
  course: React.ComponentProps<typeof CourseNameWithDot>["course"];
};

type AssignmentListProps = {
  assignments: AssignmentListItemProps[];
};

function AssignmentListItem({
  title,
  course,
  id,
  dueDate,
}: AssignmentListItemProps) {
  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <Link
          href={`/course/${course.id}/assignment/${id}`}
          scroll={false}
          className="
            line-clamp-1 
            overflow-ellipsis 
            text-sm 
            font-medium 
            leading-none 
          "
        >
          {title}
        </Link>

        <CourseNameWithDot
          className="overflow-ellipsis text-sm font-medium leading-none text-muted-foreground"
          course={course}
        />
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <span
          className={cn(
            "text-sm text-muted-foreground",
            getRelativeDateColor(dueDate),
          )}
        >
          {formatDueDate(dueDate)}
        </span>

        <AssignmentMenu
          courseId={course.id}
          assignmentId={id}
          assignmentName={title}
        />
      </div>
    </div>
  );
}

export function AssignmentListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
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
    <div className="space-y-6">
      {assignments
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )
        .map((assignment) => (
          <AssignmentListItem key={assignment.id} {...assignment} />
        ))}
    </div>
  );
}
