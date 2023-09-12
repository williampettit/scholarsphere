"use server";

import {
  type EditAssignmentFormSchema,
  editAssignmentFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";
import { revalidatePath } from "next/cache";

export async function S_editAssignment(
  data: EditAssignmentFormSchema,
) {
  const { userId } = await requireUser();

  const parsedData = editAssignmentFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse data");
  }

  const { id: assignmentId, ...assignmentData } = parsedData.data;

  await prisma.assignment
    .update({
      where: {
        id: assignmentId,
        userId: userId,
      },
      data: {
        ...assignmentData,
      },
    });

  revalidatePath("/");
}
