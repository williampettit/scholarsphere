"use server";

import prisma from "@/server/prisma";
import { S_getSession } from "@/server/auth";
import {
  addCourseFormSchema,
  SemesterTypeEnum,
  type AddCourseFormSchema,
} from "@/server/actions/schemas";

export async function S_addCourse(data: AddCourseFormSchema) {
  const session = await S_getSession();
  const userId = session?.user.id;
  if (!userId) {
    return { success: false, error: "Not logged in." };
  }

  const parsedData = addCourseFormSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, error: parsedData.error.format() };
  }

  let semesterId: string | undefined;
  switch (parsedData.data.semesterType) {
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
    case SemesterTypeEnum.existing: {
      const existingSemesterId = parsedData.data.existingSemesterId;
      if (!existingSemesterId) {
        return { success: false, error: "Missing existing semester ID." };
      }
      semesterId = existingSemesterId;
      break;
    }
    default: {
      return { success: false, error: "Invalid semester type." };
    }
  }

  const newCourse = await prisma.course.create({
    data: {
      userId: userId,
      name: parsedData.data.name,
      shortId: parsedData.data.shortId,
      creditHours: parsedData.data.creditHours,
      semesterId: semesterId,
    },
  });

  return {
    success: true,
    data: {
      id: newCourse.id,
      name: newCourse.name,
    },
  };
}
