"use server";

import {
  addCourseFormSchema,
  type AddCourseFormSchema,
  SemesterTypeEnum,
} from "@/server/actions/schemas";
import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

export async function S_addCourse(data: AddCourseFormSchema) {
  const userId = await S_requireUserId();

  const parsedData = addCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, error: parsedData.error.format() };
  }

  let semesterId: string | undefined;

  switch (parsedData.data.semesterType) {
    // new semester
    case SemesterTypeEnum.new: {
      const newSemesterData = parsedData.data.newSemesterData;

      if (!newSemesterData) {
        return { success: false, error: "Missing new semester data." };
      }

      const newSemester = await prisma.semester.create({
        data: {
          userId: userId,
          name: newSemesterData.name,
          startDate: newSemesterData.startDate,
          endDate: newSemesterData.endDate,
        },
      });

      semesterId = newSemester.id;

      break;
    }

    // existing semester
    case SemesterTypeEnum.existing: {
      const existingSemesterId = parsedData.data.existingSemesterId;

      if (!existingSemesterId) {
        return { success: false, error: "Missing existing semester ID." };
      }

      semesterId = existingSemesterId;

      break;
    }

    // invalid semester type
    default: {
      return { success: false, error: "Invalid semester type." };
    }
  }

  // create course
  const newCourse = await prisma.course.create({
    data: {
      userId: userId,
      name: parsedData.data.name,
      shortId: parsedData.data.shortId,
      creditHours: parsedData.data.creditHours,
      semesterId: semesterId,
    },
  });

  // done
  return {
    success: true,
    data: {
      id: newCourse.id,
      name: newCourse.name,
    },
  };
}
