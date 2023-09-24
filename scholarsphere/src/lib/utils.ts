import { type ClassValue, clsx } from "clsx";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

import { CourseStatusEnum, type Semester } from "@/types/shared";

dayjs.extend(relativeTime);

//
// misc utils
//

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function entries<K extends string | number, V>(
  record: Record<K, V>,
): Array<[K, V]> {
  return Object.entries(record) as Array<[K, V]>;
}

export function groupBy<T, K extends string | number>(
  array: T[],
  func: (item: T) => K,
) {
  return array.reduce((previous, current) => {
    const groupKey = func(current);
    const group = previous[groupKey] || [];
    group.push(current);
    return { ...previous, [groupKey]: group };
  }, {} as Record<K, T[]>);
}

export function getPlaceholderApiKey(): string {
  const API_KEY_LENGTH = 45;
  const API_KEY_PREFIX = "sk-";
  const API_KEY_ALPHABET =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return (
    API_KEY_PREFIX +
    Array.from(
      { length: API_KEY_LENGTH },
      () =>
        API_KEY_ALPHABET[Math.floor(Math.random() * API_KEY_ALPHABET.length)],
    ).join("")
  );
}

export function pluralize(
  count: number,
  singular: string,
  plural: string = `${singular}s`,
): string {
  return count === 1 ? singular : plural;
}

//
// grade utils
//

type GpaDiffProps = {
  color: string;
  sign: string;
};

export function getGpaDiffProps(gpaDiff: number): GpaDiffProps {
  if (gpaDiff > 0) return { color: "text-emerald-600", sign: "+" };
  if (gpaDiff < 0) return { color: "text-rose-600", sign: "-" };
  return { color: "text-muted-foreground", sign: "" };
}

export function getGradeColor(grade: number): string {
  if (grade >= 90) {
    return "text-emerald-600";
  }

  if (grade >= 80) {
    return "text-yellow-600";
  }

  if (grade >= 70) {
    return "text-amber-600";
  }

  return "text-rose-600";
}

//
// date utils
//

export function formatDueDate(dueDate: Dayjs | Date): string {
  // convert to dayjs if necessary
  if (dueDate instanceof Date) {
    dueDate = dayjs(dueDate);
  }

  return `${dueDate.fromNow()} (${dueDate.format("MMM D")})`;
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

export function getRelativeDateColor(dueDate: Dayjs | Date): string {
  // convert to dayjs if necessary
  if (dueDate instanceof Date) {
    dueDate = dayjs(dueDate);
  }

  // (assignment overdue)
  if (dueDate.isBefore(dayjs())) {
    return "text-rose-600";
  }

  // (assignment due in less than 24 hours)
  if (dueDate.isBefore(dayjs().add(24, "hour"))) {
    return "text-amber-600";
  }

  // (assignment due in less than 3 days)
  if (dueDate.isBefore(dayjs().add(3, "day"))) {
    return "text-yellow-600";
  }

  //
  return "";
}

//
// semester utils
//

type SemesterDateRange = Pick<Semester, "startDate" | "endDate">;

export function getSemesterStatus(
  semester: null | SemesterDateRange,
): CourseStatusEnum {
  // no semester found, not planned
  if (!semester) {
    return CourseStatusEnum.NOT_PLANNED;
  }

  // end date is in the past
  if (dayjs().isAfter(semester.endDate)) {
    return CourseStatusEnum.COMPLETED;
  }

  // start date is in the future
  if (dayjs().isBefore(semester.startDate)) {
    return CourseStatusEnum.PLANNED;
  }

  // start date is in the past and end date is in the future
  if (dayjs().isBefore(semester.endDate)) {
    return CourseStatusEnum.IN_PROGRESS;
  }

  // start date is in the past and end date is in the past
  return CourseStatusEnum.COMPLETED;
}

export function mapSemestersWithStatus<SemesterType>(
  semesters: (SemesterType & SemesterDateRange)[],
): (SemesterType & SemesterDateRange & { status: CourseStatusEnum })[] {
  return semesters.map((semester) => ({
    ...semester,
    status: getSemesterStatus(semester),
  }));
}
