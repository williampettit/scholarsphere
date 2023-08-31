"use server";

import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_getUserSemesters() {
  const userId = await S_requireUserId();

  return prisma.semester.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      startDate: "desc",
    },
  });
}
