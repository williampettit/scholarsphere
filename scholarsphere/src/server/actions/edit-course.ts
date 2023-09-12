"use server";

import { revalidatePath } from "next/cache";

import {
  type EditCourseFormSchema,
  editCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_editCourse(data: EditCourseFormSchema) {
  const { userId } = await requireUser();

  const parsedData = editCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, error: "Failde to parse" };
  }

  const { id: courseId, ...courseData } = parsedData.data;

  await prisma.course.update({
    where: {
      id: courseId,
      userId: userId,
    },
    data: {
      ...courseData,
    },
  });

  revalidatePath("/");
}
