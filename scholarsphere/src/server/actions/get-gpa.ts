"use server";

import { GPA } from "@/lib/gpa";
import { CourseStatusEnum } from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_getGpa() {
  const { userId } = await requireUser();

  // get all courses and semesters for user
  const { courses, semesters } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      semesters: true,
      courses: true,
    },
  });

  // map semesters to include status
  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const reducedData = courses.reduce(
    (acc, courseEntry) => {
      const courseStatus =
        semestersWithStatus.find(
          (semester) => semester.id === courseEntry.semesterId,
        )?.status ?? CourseStatusEnum.NOT_PLANNED;

      switch (courseStatus) {
        case CourseStatusEnum.COMPLETED: {
          acc.completedGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });

          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          break;
        }

        case CourseStatusEnum.IN_PROGRESS: {
          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          break;
        }
      }

      return acc;
    },
    {
      tenativeGpa: new GPA(),
      completedGpa: new GPA(),
    },
  );

  return {
    completedGpa: reducedData.completedGpa.getGpa(),
    tenativeGpa: reducedData.tenativeGpa.getGpa(),
  };
}

export async function S_getCredits() {
  const { userId } = await requireUser();

  const { semesters, courses } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      courses: {
        select: {
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

  const countedCredits = coursesWithStatus.reduce(
    (acc, course) => {
      switch (course.status) {
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
      //
      passedCredits: 0,
      attemptedCredits: 0,
      inProgressCredits: 0,
      plannedCredits: 0,
      notPlannedCredits: 0,
    },
  );

  return countedCredits;
}
