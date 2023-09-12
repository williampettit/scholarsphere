"use server";

import { CourseStatusEnum } from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_getActiveCourses() {
  const { userId } = await requireUser();

  const { semesters, courses } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      courses: {
        select: {
          id: true,
          name: true,
          shortId: true,
          semesterId: true,
          creditHours: true,
          currentGrade: true,
        },
      },
      semesters: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const coursesWithStatus = courses.map((course) => {
    const semester = semestersWithStatus.find(
      (semester) => semester.id === course.semesterId,
    );

    return {
      ...course,
      status: semester?.status ?? CourseStatusEnum.NOT_PLANNED,
    };
  });

  const activeCourses = coursesWithStatus
    .filter((course) => course.status === CourseStatusEnum.IN_PROGRESS)
    .map((course) => ({
      id: course.id,
      name: course.name,
      shortId: course.shortId,
      semesterId: course.semesterId,
      creditHours: course.creditHours,
      currentGrade: course.currentGrade,
      status: course.status,
    }));

  return activeCourses;
}
