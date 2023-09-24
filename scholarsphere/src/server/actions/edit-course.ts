"use server";

import { revalidatePath } from "next/cache";

import {
  type EditCourseFormValues,
  editCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_editCourse(data: EditCourseFormValues) {
  const { userId } = await requireUser();

  const parsedData = editCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { id: courseId, ...courseData } = parsedData.data;

  await prismaClient.course.update({
    where: {
      id: courseId,
      userId,
    },
    data: {
      ...courseData,
    },
  });

  revalidatePath("/");
}
