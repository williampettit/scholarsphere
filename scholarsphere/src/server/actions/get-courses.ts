"use server";

import { getSemesterStatus } from "@/lib/utils";
import { CourseStatusEnum } from "@/types/shared";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_getActiveCourses() {
  const { userId } = await requireUser();

  const courses = await prismaClient.course.findMany({
    where: {
      userId,
    },

    select: {
      id: true,
      name: true,
      color: true,
      shortId: true,
      semesterId: true,
      creditHours: true,
      currentGrade: true,

      semester: {
        select: {
          id: true,
          name: true,
          endDate: true,
          startDate: true,
        },
      },
    },
  });

  const coursesWithStatus = courses.map((course) => ({
    ...course,
    status: getSemesterStatus(course.semester),
  }));

  const activeCourses = coursesWithStatus.filter(
    (course) => course.status === CourseStatusEnum.IN_PROGRESS,
  );

  return activeCourses;
}
