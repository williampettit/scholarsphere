import { z } from "zod";

import {
  assignmentSchema,
  courseSchema,
  semesterSchema,
  userSchema,
  uuidSchema,
} from "@/types/shared";

//
// "Add Assignment" Form (Natural Language)
//

export const addAssignmentFromNaturalLanguageSchema = z.object({
  naturalLanguageQuery: z.string(),
  courseId: z.string(),
});

//
// "Add Assignment" Form
//

export const addAssignmentFormSchema = assignmentSchema.pick({
  courseId: true,
  name: true,
  dueDate: true,
});

export type AddAssignmentFormSchema = z.infer<typeof addAssignmentFormSchema>;

//
// "Delete Course" Form
//

export const deleteCourseFormSchema = courseSchema.pick({
  id: true,
});

export type DeleteCourseFormSchema = z.infer<typeof deleteCourseFormSchema>;

//
// "Delete Session" Form
//

export const deleteSessionFormSchema = z.object({
  id: z.string().nonempty(),
});

export type DeleteSessionFormSchema = z.infer<typeof deleteSessionFormSchema>;

//
// "Add Course" Form
//

export enum CreateSemesterTypeEnum {
  new,
  existing,
}

export const addCourseFormSchema = courseSchema
  .pick({
    name: true,
    shortId: true,
    creditHours: true,
    semesterId: true,
  })
  .extend({
    semesterType: z.nativeEnum(CreateSemesterTypeEnum),
    newSemesterData: semesterSchema
      .pick({
        name: true,
        startDate: true,
        endDate: true,
      })
      .optional(),
  });

export type AddCourseFormSchema = z.infer<typeof addCourseFormSchema>;

//
// "Edit Course" Form
//

export const editCourseFormSchema = courseSchema
  .pick({
    id: true,
    name: true,
    shortId: true,
    description: true,
    currentGrade: true,
    creditHours: true,
  })
  .partial({
    name: true,
    shortId: true,
    description: true,
    currentGrade: true,
    creditHours: true,
  });

export type EditCourseFormSchema = z.infer<typeof editCourseFormSchema>;

//
// "Edit Assignment" Form
//

export const editAssignmentFormSchema = assignmentSchema
  .pick({
    id: true,
    name: true,
    dueDate: true,
  })
  .partial({
    name: true,
    dueDate: true,
  });

export type EditAssignmentFormSchema = z.infer<typeof editAssignmentFormSchema>;

//
// "Edit User" Form
//

export const editUserFormSchema = userSchema
  .pick({
    name: true,
    openaiApiKey: true,
  })
  .partial({
    name: true,
    openaiApiKey: true,
  });

export type EditUserFormSchema = z.infer<typeof editUserFormSchema>;
