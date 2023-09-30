"use server";

import { revalidatePath } from "next/cache";

import {
  type AddAssignmentFormValues,
  addAssignmentFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_addAssignment(data: AddAssignmentFormValues) {
  const { userId } = await requireUser();

  const parsedData = addAssignmentFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  await prismaClient.assignment.create({
    data: {
      userId,
      courseId: parsedData.data.courseId,
      title: parsedData.data.title,
      dueDate: parsedData.data.dueDate,
    },
  });

  revalidatePath("/");
}
