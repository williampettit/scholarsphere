"use server";

import {
  type AddCourseFormSchema,
  CreateSemesterTypeEnum,
  addCourseFormSchema,
} from "@/server/actions/schemas";
import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";
import { revalidatePath } from "next/cache";

export async function S_addCourse(data: AddCourseFormSchema) {
  const { userId } = await requireUser();

  const parsedData = addCourseFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse data");
  }

  let semesterId: string | undefined;

  switch (parsedData.data.semesterType) {
    // (new semester)
    case CreateSemesterTypeEnum.new: {
      const newSemesterData = parsedData.data.newSemesterData;

      if (!newSemesterData) {
        throw new Error("Missing new semester data");
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

    // (existing semester)
    case CreateSemesterTypeEnum.existing: {
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
  await prisma.course
    .create({
      data: {
        userId: userId,
        name: parsedData.data.name,
        shortId: parsedData.data.shortId,
        creditHours: parsedData.data.creditHours,
        semesterId: semesterId,
      },
    })

  revalidatePath("/");
}
