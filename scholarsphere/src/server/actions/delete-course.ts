"use server";

import {
  type DeleteCourseFormSchema,
  deleteCourseFormSchema,
} from "@/server/actions/schemas";
import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_deleteCourse(data: DeleteCourseFormSchema) {
  // return { success: false, error: "Deleting courses is temporarily disabled." };

  const userId = await S_requireUserId();

  const parsedData = deleteCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, error: parsedData.error.format() };
  }

  await prisma.course.delete({
    where: {
      userId: userId,
      id: parsedData.data.id,
    },
  });

  return { success: true };
}
