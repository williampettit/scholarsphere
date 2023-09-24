"use server";

import { revalidatePath } from "next/cache";

import {
  type EditAssignmentFormValues,
  editAssignmentFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_editAssignment(data: EditAssignmentFormValues) {
  const { userId } = await requireUser();

  const parsedData = editAssignmentFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { id: assignmentId, ...assignmentData } = parsedData.data;

  await prismaClient.assignment.update({
    where: {
      id: assignmentId,
      userId,
    },
    data: {
      ...assignmentData,
    },
  });

  revalidatePath("/", "layout");
}
