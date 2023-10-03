import { CourseStatusEnum } from "@/types/shared";

import { Icons } from "@/components/icons";

type CourseStatusMap = {
  [key in CourseStatusEnum]: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    classes: string;
    order: number;
  };
};

export const COURSE_STATUS_MAP: CourseStatusMap = {
  [CourseStatusEnum.IN_PROGRESS]: {
    label: "In Progress",
    icon: Icons.CourseInProgress,
    classes: "text-yellow-600",
    order: 0,
  },
  [CourseStatusEnum.PLANNED]: {
    label: "Planned",
    icon: Icons.CoursePlanned,
    classes: "text-pink-600",
    order: 1,
  },
  [CourseStatusEnum.COMPLETED]: {
    label: "Completed",
    icon: Icons.CourseCompleted,
    classes: "text-emerald-600",
    order: 2,
  },
  [CourseStatusEnum.NOT_PLANNED]: {
    label: "Not Planned",
    icon: Icons.CourseNotPlanned,
    classes: "text-rose-600",
    order: 3,
  },
};
