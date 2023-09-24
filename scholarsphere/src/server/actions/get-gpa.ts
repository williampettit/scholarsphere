"use server";

import { GPA } from "@/lib/gpa";
import { getSemesterStatus } from "@/lib/utils";
import { CourseStatusEnum } from "@/types/shared";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_getGpa() {
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

  const { completedGpa, tenativeGpa } = courses.reduce(
    (acc, course) => {
      const courseStatus = getSemesterStatus(course.semester);

      switch (courseStatus) {
        // completed
        case CourseStatusEnum.COMPLETED: {
          acc.completedGpa.addCourse({
            grade: course.currentGrade,
            creditHours: course.creditHours,
          });

          acc.tenativeGpa.addCourse({
            grade: course.currentGrade,
            creditHours: course.creditHours,
          });

          break;
        }

        // in progress
        case CourseStatusEnum.IN_PROGRESS: {
          acc.tenativeGpa.addCourse({
            grade: course.currentGrade,
            creditHours: course.creditHours,
          });

          break;
        }
      }

      return acc;
    },
    {
      completedGpa: new GPA(),
      tenativeGpa: new GPA(),
    },
  );

  return {
    completedGpa: completedGpa.getGpa(),
    tenativeGpa: tenativeGpa.getGpa(),
  };
}
