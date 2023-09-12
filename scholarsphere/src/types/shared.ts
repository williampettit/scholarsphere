import { z } from "zod";

//
// Export Database Models
//

export {
  type Course,
  type Assignment,
  type Semester,
  type UserRole,
} from "@prisma/client";

export type ServerActionResponse = {
  success: true;
} | {
  success: false;
  error?: string;
}

//
// Shared Enums
//

export enum CourseStatusEnum {
  COMPLETED,
  IN_PROGRESS,
  PLANNED,
  NOT_PLANNED,
}

export type CourseStatusEnumKey = keyof typeof CourseStatusEnum;

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
export const MAX_ASSIGNMENT_NAME_LENGTH = 255;

//
//
// Shared Schemas
//
//

// Base UUID Schema
export const uuidSchema = z.string().uuid({
  message: "Invalid UUID",
});

//
// User
//

// Base User Schema
export const userSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(MAX_USER_NAME_LENGTH).nullable(),
  email: z.string().email().max(MAX_USER_EMAIL_LENGTH).nullable(),
  openaiApiKey: z.string().nullable(),
});

//
// Semester
//

// Base Semester Schema
export const semesterSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(MAX_SEMESTER_NAME_LENGTH),
  startDate: z.date(),
  endDate: z.date(),
});

//
// Course
//

// Base Course Schema
export const courseSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(MAX_COURSE_NAME_LENGTH),
  shortId: z.string().min(1).max(MAX_COURSE_SHORT_ID_LENGTH).nullable(),
  description: z.string().max(MAX_COURSE_DESCRIPTION_LENGTH).nullable(),
  creditHours: z.number().int().positive(),
  currentGrade: z.number().int().min(0).max(100),
  status: z.nativeEnum(CourseStatusEnum),
  color: z
    .string()
    .length(MAX_COURSE_COLOR_LENGTH)
    .regex(/^[0-9a-fA-F]{6}$/i)
    .transform((str) => str.toLowerCase())
    .nullable(),
  semesterId: uuidSchema.nullable(),
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
  id: uuidSchema,
  name: z.string().min(1).max(MAX_ASSIGNMENT_NAME_LENGTH),
  dueDate: z.date(),
  courseId: uuidSchema,
});
