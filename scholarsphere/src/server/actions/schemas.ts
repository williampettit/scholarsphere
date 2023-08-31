import { z } from "zod";

import { baseCourseSchema, baseUuidSchema } from "@/types/shared";

//
// "Add Assignment" Form
//

export const addAssignmentFormSchema = z.object({
  courseId: baseUuidSchema,
  name: z.string().min(1).max(255),
  dueDate: z.date(),
});

export type AddAssignmentFormSchema = z.infer<typeof addAssignmentFormSchema>;

//
// "Delete Course" Form
//

export const deleteCourseFormSchema = z.object({
  id: baseUuidSchema,
});

export type DeleteCourseFormSchema = z.infer<typeof deleteCourseFormSchema>;

//
// "Add Course" Form
//

export enum SemesterTypeEnum {
  new,
  existing,
}

export const addCourseFormSchema = baseCourseSchema.extend({
  semesterType: z.nativeEnum(SemesterTypeEnum),
  existingSemesterId: baseUuidSchema.optional(),
  newSemesterData: z
    .object({
      name: z.string().min(1).max(255),
      startDate: z.date(),
      endDate: z.date(),
    })
    .optional(),
});

export type AddCourseFormSchema = z.infer<typeof addCourseFormSchema>;
