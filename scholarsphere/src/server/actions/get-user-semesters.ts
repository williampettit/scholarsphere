"use server";

import prisma from "@/server/prisma";
import { S_getSession } from "@/server/auth";

export async function S_getUserSemesters() {
  const session = await S_getSession();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("No session");
  }
  return prisma.semester.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      startDate: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });
}
