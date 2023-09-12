import { type ClassValue, clsx } from "clsx";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFromNow(date: Dayjs | Date): string {
  // convert to dayjs if necessary
  if (date instanceof Date) {
    date = dayjs(date);
  }

  return date.fromNow();
}

export function withinNDays(
  dueDate: Dayjs | Date,
  nDays: number = 30,
): boolean {
  // convert to dayjs if necessary
  if (dueDate instanceof Date) {
    dueDate = dayjs(dueDate);
  }

  return dueDate.diff(dayjs(), "day") <= nDays;
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

export function formatAssignmentDueDate(dueDate: Dayjs | Date): string {
  // convert to dayjs if necessary
  if (dueDate instanceof Date) {
    dueDate = dayjs(dueDate);
  }

  return `${dueDate.fromNow()} (${dueDate.format("MMM D")})`;
}

export function genPlaceholderApiKey() {
  const API_KEY_ALPHABET =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return (
    "sk-" +
    Array.from(
      { length: 45 },
      () =>
        API_KEY_ALPHABET[Math.floor(Math.random() * API_KEY_ALPHABET.length)],
    ).join("")
  );
}
