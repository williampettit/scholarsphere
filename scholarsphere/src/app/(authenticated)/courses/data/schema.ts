import { z } from "zod";

export const courseTableEntrySchema = z.object({
  id: z.string().uuid(),
  short_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["COMPLETED", "PLANNED", "NOT_PLANNED", "IN_PROGRESS"]),
  credit_hours: z.number(),
  grade: z.number(),
});

export type CourseTableEntryType = z.infer<typeof courseTableEntrySchema>;

export type CourseStatusString = CourseTableEntryType["status"];
