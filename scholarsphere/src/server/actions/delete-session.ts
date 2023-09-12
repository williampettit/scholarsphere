"use server";

import { revalidatePath } from "next/cache";

import {
  type DeleteSessionFormSchema,
  deleteSessionFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_deleteSession(data: DeleteSessionFormSchema) {
  const { userId } = await requireUser();

  const parsedData = deleteSessionFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse data");
  }

  await prisma.session.delete({
    where: {
      userId: userId,
      id: parsedData.data.id,
    },
  });

  revalidatePath("/");
}
