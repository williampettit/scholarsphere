"use server";

import { revalidatePath } from "next/cache";

import {
  type DeleteSessionFormValues,
  deleteSessionFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_deleteSession(data: DeleteSessionFormValues) {
  const { userId } = await requireUser();

  const parsedData = deleteSessionFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  await prismaClient.session.delete({
    where: {
      userId,
      id: parsedData.data.id,
    },
  });

  revalidatePath("/");
}
