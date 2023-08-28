import { z } from "zod";

//
// Shared Constants
//

const MAX_COURSE_NAME_LENGTH = 255;
const MAX_COURSE_SHORT_ID_LENGTH = 255;

//
// Shared Types
//

export enum CourseStatusEnum {
  COMPLETED,
  PLANNED,
  NOT_PLANNED,
  IN_PROGRESS,
}

export type CourseStatusEnumKey = keyof typeof CourseStatusEnum;

//
// Shared Schemas
//

// Base "UUID" Schema
export const baseUuidSchema = z.string().uuid({
  message: "Invalid UUID",
});

// Base "Course" Schema
export const baseCourseSchema = z.object({
  name: z.string().min(1).max(MAX_COURSE_NAME_LENGTH),
  shortId: z.string().min(1).max(MAX_COURSE_SHORT_ID_LENGTH),
  creditHours: z.number().int().positive(),
});

// Course Table Entry Schema
export const courseTableEntrySchema = baseCourseSchema.extend({
  id: baseUuidSchema,
  description: z.string().nullable(),
  currentGrade: z.number().gte(0).lte(100),
  status: z.nativeEnum(CourseStatusEnum).default(CourseStatusEnum.NOT_PLANNED),
});

export type CourseTableEntryType = z.infer<typeof courseTableEntrySchema>;
