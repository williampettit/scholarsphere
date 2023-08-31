"use server";

import {
  type AddAssignmentFormSchema,
  addAssignmentFormSchema,
} from "@/server/actions/schemas";
import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_addAssignment(data: AddAssignmentFormSchema) {
  const userId = await S_requireUserId();

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
