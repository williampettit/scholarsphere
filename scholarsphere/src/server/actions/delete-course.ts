"use server";

import prisma from "@/server/prisma";
import { S_getSession } from "@/server/auth";
import {
  type DeleteCourseFormSchema,
  deleteCourseFormSchema,
} from "@/server/actions/schemas";

export async function S_deleteCourse(data: DeleteCourseFormSchema) {
  // return { success: false, error: "Deleting courses is temporarily disabled." };
  const session = await S_getSession();
  const userId = session?.user.id;
  if (!userId) {
    return { success: false, error: "Not logged in." };
  }
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
