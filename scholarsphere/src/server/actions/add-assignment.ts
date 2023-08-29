"use server";

import prisma from "@/server/prisma";
import { S_getSession } from "@/server/auth";
import {
  type AddAssignmentFormSchema,
  addAssignmentFormSchema,
} from "@/server/actions/schemas";

export async function S_addAssignment(data: AddAssignmentFormSchema) {
  const session = await S_getSession();
  const userId = session?.user.id;
  if (!userId) {
    return { success: false, error: "Not logged in." };
  }
  const parsedData = addAssignmentFormSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, error: parsedData.error.format() };
  }
  await prisma.assignment.create({
    data: {
      userId: userId,
      courseId: parsedData.data.courseId,
      title: parsedData.data.name,
      dueDate: parsedData.data.dueDate,
    },
  });
  return {
    success: true,
  };
}
