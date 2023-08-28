"use server";

import dayjs from "dayjs";
import prisma from "@/server/prisma";
import { S_getUser } from "@/server/auth";
import { CourseStatusEnum } from "@/types/shared";

export async function S_getUserData() {
  const { id: userId, ...otherUserInfo } = await S_getUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      semesters: true,
      courses: {
        include: {
          assignments: true,
        },
      },
    },
  });
  return {
    ...otherUserInfo,
    ...user,
    semesters: user.semesters.map((semester) => ({
      ...semester,
      status: ((): CourseStatusEnum => {
        if (dayjs().isAfter(semester.endDate)) {
          // end date is in the past
          return CourseStatusEnum.COMPLETED;
        } else if (dayjs().isBefore(semester.startDate)) {
          // start date is in the future
          return CourseStatusEnum.PLANNED;
        } else if (dayjs().isBefore(semester.endDate)) {
          // start date is in the past and end date is in the future
          return CourseStatusEnum.IN_PROGRESS;
        } else {
          // start date is in the past and end date is in the past
          return CourseStatusEnum.COMPLETED;
        }
      })(),
    })),
  };
}
