import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradeColor(grade: number): string {
  if (grade >= 90) {
    return "text-green-500";
  } else if (grade >= 80) {
    return "text-yellow-500";
  } else if (grade >= 70) {
    return "text-orange-500";
  } else {
    return "text-red-500";
  }
}
