"use server";

import { revalidatePath } from "next/cache";

import {
  type EditUserFormValues,
  editUserFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_editUser(data: EditUserFormValues) {
  const { userId } = await requireUser();

  const parsedData = editUserFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      ...parsedData.data,
    },
  });

  revalidatePath("/");
}
