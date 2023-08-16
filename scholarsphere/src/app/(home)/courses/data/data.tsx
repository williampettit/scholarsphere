import {
  CalendarIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const statuses = [
  {
    value: "NOT_PLANNED",
    label: "Not Planned",
    icon: QuestionMarkCircledIcon,
    color: "text-red-500",
  },
  {
    value: "PLANNED",
    label: "Planned",
    icon: CalendarIcon,
    color: "text-pink-500",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: StopwatchIcon,
    color: "text-yellow-500",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CheckCircledIcon,
    color: "text-green-500",
  },
]
