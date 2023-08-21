import { z } from "zod";

export const courseTableEntrySchema = z.object({
  id: z.string().uuid(),
  shortId: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["COMPLETED", "PLANNED", "NOT_PLANNED", "IN_PROGRESS"]),
  creditHours: z.number(),
  currentGrade: z.number(),
});

export type CourseTableEntryType = z.infer<typeof courseTableEntrySchema>;

export type CourseStatusString = CourseTableEntryType["status"];
