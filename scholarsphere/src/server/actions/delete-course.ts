"use server";

import { revalidatePath } from "next/cache";

import {
  type DeleteCourseFormSchema,
  deleteCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_deleteCourse(data: DeleteCourseFormSchema) {
  // return { success: false, error: "Deleting courses is temporarily disabled" };

  const { userId } = await requireUser();

  const parsedData = deleteCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse data");
  }

  await prisma.course.delete({
    where: {
      userId: userId,
      id: parsedData.data.id,
    },
  });

  revalidatePath("/");
}
