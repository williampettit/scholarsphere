"use server";

import { revalidatePath } from "next/cache";

import {
  type DeleteAssignmentFormValues,
  deleteAssignmentFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_deleteAssignment(data: DeleteAssignmentFormValues) {
  const { userId } = await requireUser();

  const parsedData = deleteAssignmentFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { id: assignmentId } = parsedData.data;

  await prismaClient.assignment.delete({
    where: {
      id: assignmentId,
      userId,
    },
  });

  revalidatePath("/");
}
