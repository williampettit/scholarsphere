"use server";

import { getSemesterStatus } from "@/lib/utils";
import { CourseStatusEnum } from "@/types/shared";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_getCredits() {
  const { userId } = await requireUser();

  const courses = await prismaClient.course.findMany({
    where: {
      userId,
    },
    select: {
      creditHours: true,
      currentGrade: true,

      semester: {
        select: {
          endDate: true,
          startDate: true,
        },
      },
    },
  });

  return courses.reduce(
    (acc, course) => {
      const courseStatus = getSemesterStatus(course.semester);

      switch (courseStatus) {
        // completed
        case CourseStatusEnum.COMPLETED: {
          acc.attemptedCredits += course.creditHours;

          // (if completed + passed course)
          if (course.currentGrade >= 70) {
            acc.passedCredits += course.creditHours;
          }

          break;
        }

        // in progress
        case CourseStatusEnum.IN_PROGRESS: {
          acc.inProgressCredits += course.creditHours;
          break;
        }

        // planned
        case CourseStatusEnum.PLANNED: {
          acc.plannedCredits += course.creditHours;
          break;
        }

        // not planned
        case CourseStatusEnum.NOT_PLANNED: {
          acc.notPlannedCredits += course.creditHours;
          break;
        }
      }

      return acc;
    },
    {
      passedCredits: 0,
      plannedCredits: 0,
      attemptedCredits: 0,
      inProgressCredits: 0,
      notPlannedCredits: 0,
    },
  );
}
