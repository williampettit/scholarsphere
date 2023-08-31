import { type ClassValue, clsx } from "clsx";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withinNDays(dueDate: Date, nDays: number = 30): boolean {
  return dayjs(dueDate).diff(dayjs(), "day") <= nDays;
}

export function getCourseGradeColor(grade: number): string {
  if (grade >= 90) {
    return "text-green-500";
  }

  if (grade >= 80) {
    return "text-yellow-500";
  }

  if (grade >= 70) {
    return "text-orange-500";
  }

  return "text-red-500";
}

export function getAssignmentDueDateColor(dueDate: Dayjs | Date) {
  // convert to dayjs if necessary
  if (dueDate instanceof Date) {
    dueDate = dayjs(dueDate);
  }

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
