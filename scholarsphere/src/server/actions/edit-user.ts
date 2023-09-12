"use server";

import { revalidatePath } from "next/cache";

import {
  type EditUserFormSchema,
  editUserFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_editUser(data: EditUserFormSchema) {
  const { userId } = await requireUser();

  const parsedData = editUserFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, error: "Failed to parse data" };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...parsedData.data,
    },
  });

  revalidatePath("/");
}
