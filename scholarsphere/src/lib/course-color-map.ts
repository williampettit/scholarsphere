import { CourseColor } from "@/types/shared";

type ColorCode = `#${string}`;

type CourseColorMap = {
  [key in CourseColor]: ColorCode;
};

export const COURSE_COLOR_MAP: CourseColorMap = {
  // [CourseColor.SLATE]: "#475569",
  [CourseColor.GRAY]: "#4b5563",
  // [CourseColor.ZINC]: "#52525b",
  // [CourseColor.NEUTRAL]: "#525252",
  // [CourseColor.STONE]: "#57534e",
  [CourseColor.RED]: "#dc2626",
  [CourseColor.ORANGE]: "#ea580c",
  // [CourseColor.AMBER]: "#d97706",
  [CourseColor.YELLOW]: "#ca8a04",
  [CourseColor.LIME]: "#65a30d",
  // [CourseColor.GREEN]: "#16a34a",
  [CourseColor.EMERALD]: "#059669",
  // [CourseColor.TEAL]: "#0d9488",
  // [CourseColor.CYAN]: "#0891b2",
  [CourseColor.SKY]: "#0284c7",
  [CourseColor.BLUE]: "#2563eb",
  [CourseColor.INDIGO]: "#4f46e5",
  [CourseColor.VIOLET]: "#7c3aed",
  // [CourseColor.PURPLE]: "#9333ea",
  [CourseColor.FUCHSIA]: "#c026d3",
  [CourseColor.PINK]: "#db2777",
  // [CourseColor.ROSE]: "#e11d48",
} as const;
