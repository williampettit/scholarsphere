"use server";

import dayjs from "dayjs";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_getUpcomingAssignments() {
  const { userId } = await requireUser();

  return prisma.assignment.findMany({
    where: {
      userId: userId,
      isComplete: false,
      dueDate: {
        lte: dayjs().add(14, "day").toDate(),
      },
      course: {
        semester: {
          startDate: {
            lte: new Date(),
          },
          endDate: {
            gte: new Date(),
          },
        },
      },
    },
    select: {
      title: true,
      dueDate: true,
      course: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });
}
