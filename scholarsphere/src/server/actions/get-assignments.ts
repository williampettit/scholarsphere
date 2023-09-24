"use server";

import dayjs from "dayjs";

import { getSemesterStatus } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_getUpcomingAssignments() {
  const { userId } = await requireUser();

  const assignments = await prismaClient.assignment.findMany({
    where: {
      userId,
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
      id: true,
      title: true,
      dueDate: true,
      isComplete: true,

      course: {
        select: {
          id: true,
          name: true,
          color: true,
          shortId: true,
          description: true,
          creditHours: true,
          currentGrade: true,

          semester: {
            select: {
              id: true,
              endDate: true,
              startDate: true,
            },
          },
        },
      },
    },

    orderBy: {
      dueDate: "asc",
    },
  });

  const assignmentsWithCourseStatus = assignments.map((assignment) => ({
    ...assignment,
    course: {
      ...assignment.course,
      status: getSemesterStatus(assignment.course.semester),
    },
  }));

  return assignmentsWithCourseStatus;
}

export async function S_getRecentlyCompletedAssignments() {
  const { userId } = await requireUser();

  const assignments = await prismaClient.assignment.findMany({
    where: {
      userId,
      isComplete: true,
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
      id: true,
      title: true,
      dueDate: true,
      isComplete: true,

      course: {
        select: {
          id: true,
          name: true,
          color: true,
          shortId: true,
          description: true,
          creditHours: true,
          currentGrade: true,

          semester: {
            select: {
              id: true,
              endDate: true,
              startDate: true,
            },
          },
        },
      },
    },

    orderBy: {
      dueDate: "asc",
    },
  });

  const assignmentsWithCourseStatus = assignments.map((assignment) => ({
    ...assignment,
    course: {
      ...assignment.course,
      status: getSemesterStatus(assignment.course.semester),
    },
  }));

  return assignmentsWithCourseStatus;
}
