import {
  type Assignment,
  type Course,
  CourseColor,
  type Semester,
} from "@prisma/client";

import { z } from "zod";

//
// Export Database Models
//

export {
  type Course,
  type Assignment,
  type Semester,
  UserRole,
  CourseColor,
} from "@prisma/client";

//
// Shared Enums
//

export enum CourseStatusEnum {
  IN_PROGRESS,
  PLANNED,
  COMPLETED,
  NOT_PLANNED,
}

export type CourseStatusEnumKey = keyof typeof CourseStatusEnum;

//
// Shared Types
//

export type CourseBasicInfo = Pick<
  Course,
  | "id"
  | "name"
  | "shortId"
  | "description"
  | "creditHours"
  | "currentGrade"
  | "color"
> & {
  status: CourseStatusEnum;
  semester?: Pick<Semester, "name" | "startDate" | "endDate"> | null;
};

export type AssignmentBasicInfo = Pick<
  Assignment,
  "id" | "title" | "dueDate" | "isComplete"
>;

//
// Shared Constants
//

// User
export const MAX_USER_NAME_LENGTH = 255;
export const MAX_USER_EMAIL_LENGTH = 255;

// Semester
export const MAX_SEMESTER_NAME_LENGTH = 255;

// Course
export const MAX_COURSE_NAME_LENGTH = 255;
export const MAX_COURSE_SHORT_ID_LENGTH = 255;
export const MAX_COURSE_DESCRIPTION_LENGTH = 1024;
export const MAX_COURSE_COLOR_LENGTH = 6;

// Assignment
export const MAX_ASSIGNMENT_TITLE_LENGTH = 255;

//
//
// Shared Schemas
//
//

// NanoID Schema
export const nanoidSchema = z.string().regex(/^[0-9a-zA-Z_-]{21}$/, {
  message: "Invalid ID",
});

//
// User
//

// Base User Schema
export const userSchema = z.object({
  id: nanoidSchema,
  name: z.string().min(1).max(MAX_USER_NAME_LENGTH).nullable(),
  email: z.string().email().max(MAX_USER_EMAIL_LENGTH).nullable(),
  openAiApiKey: z.string().nullable(),
});

//
// Semester
//

// Base Semester Schema
export const semesterSchema = z.object({
  id: nanoidSchema,
  name: z.string().min(1).max(MAX_SEMESTER_NAME_LENGTH),
  startDate: z.date(),
  endDate: z.date(),
});

//
// Course
//

// Base Course Schema
export const courseSchema = z.object({
  id: nanoidSchema,
  name: z.string().min(1).max(MAX_COURSE_NAME_LENGTH),
  shortId: z.string().min(1).max(MAX_COURSE_SHORT_ID_LENGTH).nullable(),
  description: z.string().max(MAX_COURSE_DESCRIPTION_LENGTH).nullable(),
  creditHours: z.number().int().positive(),
  currentGrade: z.number().int().min(0).max(100),
  status: z.nativeEnum(CourseStatusEnum),
  color: z.nativeEnum(CourseColor),
  semesterId: nanoidSchema.nullable(),
});

// Course Table Entry Schema
export const courseTableEntrySchema = courseSchema.pick({
  id: true,
  name: true,
  shortId: true,
  description: true,
  creditHours: true,
  currentGrade: true,
  status: true,
  color: true,
});

export type CourseTableEntryType = z.infer<typeof courseTableEntrySchema>;

//
// Assignment
//

// Base Assignment Schema
export const assignmentSchema = z.object({
  id: nanoidSchema,
  title: z.string().min(1).max(MAX_ASSIGNMENT_TITLE_LENGTH),
  dueDate: z.date(),
  courseId: nanoidSchema,
  isComplete: z.boolean(),
});
