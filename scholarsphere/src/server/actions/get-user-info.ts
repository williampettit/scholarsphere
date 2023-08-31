"use server";

import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_getUserInfo() {
  const userId = await S_requireUserId();

  return prisma.user.findMany({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
}
