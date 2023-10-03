import { z } from "zod";

import {
  assignmentSchema,
  courseSchema,
  nanoidSchema,
  semesterSchema,
  userSchema,
} from "@/types/shared";

//
// "Add Assignment" Form (from natural language)
//

export const addAssignmentFromNaturalLanguageSchema = z.object({
  courseId: nanoidSchema,
  naturalLanguageQuery: z.string().nonempty(),
});

export type AddAssignmentFromNaturalLanguageValues = z.infer<
  typeof addAssignmentFromNaturalLanguageSchema
>;

//
// "Add Assignment" Form
//

export const addAssignmentFormSchema = assignmentSchema.pick({
  courseId: true,
  title: true,
  dueDate: true,
});

export type AddAssignmentFormValues = z.infer<typeof addAssignmentFormSchema>;

//
// "Delete Course" Form
//

export const deleteCourseFormSchema = courseSchema.pick({
  id: true,
});

export type DeleteCourseFormValues = z.infer<typeof deleteCourseFormSchema>;

//
// "Delete Session" Form
//

export const deleteSessionFormSchema = z.object({
  id: nanoidSchema,
});

export type DeleteSessionFormValues = z.infer<typeof deleteSessionFormSchema>;

//
// "Add Course" Form
//

export const addCourseFormSemesterTypeSchema = z
  .literal("new")
  .or(z.literal("existing"));

export const addCourseFormSchema = courseSchema
  .pick({
    name: true,
    shortId: true,
    creditHours: true,
    semesterId: true,
  })
  .extend({
    semesterType: addCourseFormSemesterTypeSchema,
    newSemesterData: semesterSchema
      .pick({
        name: true,
        startDate: true,
        endDate: true,
      })
      .optional(),
  });

export type AddCourseFormValues = z.infer<typeof addCourseFormSchema>;

export type AddCourseFormSemesterType = z.infer<
  typeof addCourseFormSemesterTypeSchema
>;

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
    color: true,
    courseUrl: true,
    syllabusUrl: true,
  })
  .partial({
    name: true,
    shortId: true,
    description: true,
    currentGrade: true,
    creditHours: true,
    color: true,
    courseUrl: true,
    syllabusUrl: true,
  });

export type EditCourseFormValues = z.infer<typeof editCourseFormSchema>;

//
// "Edit Assignment" Form
//

export const editAssignmentFormSchema = assignmentSchema
  .pick({
    id: true,
    title: true,
    dueDate: true,
    isComplete: true,
  })
  .partial({
    title: true,
    dueDate: true,
    isComplete: true,
  });

export type EditAssignmentFormValues = z.infer<typeof editAssignmentFormSchema>;

//
// "Delete Assignment" Form
//

export const deleteAssignmentFormSchema = assignmentSchema.pick({
  id: true,
});

export type DeleteAssignmentFormValues = z.infer<
  typeof deleteAssignmentFormSchema
>;

//
// "Edit User" Form
//

export const editUserFormSchema = userSchema
  .pick({
    name: true,
    openAiApiKey: true,
  })
  .partial({
    name: true,
    openAiApiKey: true,
  });

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

//
// "AI Chat" Settings Form
//

export const editAiChatSettingsFormSchema = userSchema.pick({
  openAiApiKey: true,
});

export type EditAiChatSettingsFormValues = z.infer<
  typeof editAiChatSettingsFormSchema
>;
