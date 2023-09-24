import { CourseStatusEnum } from "@/types/shared";

import { Icons } from "@/components/icons";

type CourseStatusesProps = {
  [key in CourseStatusEnum]: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    order: number;
  };
};

export const COURSE_STATUSES: CourseStatusesProps = {
  [CourseStatusEnum.IN_PROGRESS]: {
    label: "In Progress",
    icon: Icons.CourseInProgress,
    color: "text-yellow-600",
    order: 0,
  },
  [CourseStatusEnum.PLANNED]: {
    label: "Planned",
    icon: Icons.CoursePlanned,
    color: "text-pink-600",
    order: 1,
  },
  [CourseStatusEnum.COMPLETED]: {
    label: "Completed",
    icon: Icons.CourseCompleted,
    color: "text-emerald-600",
    order: 2,
  },
  [CourseStatusEnum.NOT_PLANNED]: {
    label: "Not Planned",
    icon: Icons.CourseNotPlanned,
    color: "text-rose-600",
    order: 3,
  },
};
