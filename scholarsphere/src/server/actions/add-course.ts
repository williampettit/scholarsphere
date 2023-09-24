"use server";

import { revalidatePath } from "next/cache";

import {
  type AddCourseFormValues,
  addCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

export async function S_addCourse(data: AddCourseFormValues) {
  const { userId } = await requireUser();

  const parsedData = addCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  let semesterId: string | undefined;

  switch (parsedData.data.semesterType) {
    // (new semester)
    case "new": {
      const newSemesterData = parsedData.data.newSemesterData;

      if (!newSemesterData) {
        throw new Error("Missing new semester data");
      }

      const newSemester = await prismaClient.semester.create({
        data: {
          userId,
          name: newSemesterData.name,
          startDate: newSemesterData.startDate,
          endDate: newSemesterData.endDate,
        },
      });

      semesterId = newSemester.id;

      break;
    }

    // (existing semester)
    case "existing": {
      const existingSemesterId = parsedData.data.semesterId;

      if (!existingSemesterId) {
        throw new Error("Missing existing semester ID");
      }

      semesterId = existingSemesterId;

      break;
    }

    // invalid semester type
    default: {
      throw new Error("Invalid semester type");
    }
  }

  // create course
  await prismaClient.course.create({
    data: {
      userId,
      name: parsedData.data.name,
      shortId: parsedData.data.shortId,
      creditHours: parsedData.data.creditHours,
      semesterId: semesterId,
    },
  });

  revalidatePath("/");
}
