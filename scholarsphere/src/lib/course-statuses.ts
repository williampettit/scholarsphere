import {
  CalendarIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

import { CourseStatusEnum } from "@/types/shared";

type CourseStatusesProps = {
  [key in CourseStatusEnum]: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
};

export const COURSE_STATUSES: CourseStatusesProps = {
  [CourseStatusEnum.NOT_PLANNED]: {
    label: "Not Planned",
    icon: QuestionMarkCircledIcon,
    color: "text-red-500",
  },
  [CourseStatusEnum.PLANNED]: {
    label: "Planned",
    icon: CalendarIcon,
    color: "text-pink-500",
  },
  [CourseStatusEnum.IN_PROGRESS]: {
    label: "In Progress",
    icon: StopwatchIcon,
    color: "text-yellow-500",
  },
  [CourseStatusEnum.COMPLETED]: {
    label: "Completed",
    icon: CheckCircledIcon,
    color: "text-green-500",
  },
};
