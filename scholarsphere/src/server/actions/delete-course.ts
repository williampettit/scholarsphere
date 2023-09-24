"use server";

import { revalidatePath } from "next/cache";

import {
  type DeleteCourseFormValues,
  deleteCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_deleteCourse(data: DeleteCourseFormValues) {
  // return { success: false, error: "Deleting courses is temporarily disabled" };

  const { userId } = await requireUser();

  const parsedData = deleteCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  await prismaClient.course.delete({
    where: {
      userId,
      id: parsedData.data.id,
    },
  });

  revalidatePath("/");
}
