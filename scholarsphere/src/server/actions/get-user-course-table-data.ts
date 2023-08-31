"use server";

import { z } from "zod";

import {
  CourseStatusEnum,
  courseTableEntrySchema,
  type CourseTableEntryType,
} from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

interface GetCourseTableDataReturnTypeSuccess {
  success: true;
  data: CourseTableEntryType[];
}

interface GetCourseTableDataReturnTypeError {
  success: false;
  error: string;
}

type GetCourseTableDataReturnType =
  | GetCourseTableDataReturnTypeSuccess
  | GetCourseTableDataReturnTypeError;

export async function S_getCourseTableData(): Promise<GetCourseTableDataReturnType> {
  const userId = await S_requireUserId();

  const { semesters, courses } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      courses: true,
      semesters: true,
    },
  });

  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const courseTableData = courses.map((course) => {
    const semester = semestersWithStatus.find(
      (semester) => semester.id === course.semesterId,
    );

    return {
      ...course,
      semester: semester,
      status: semester?.status ?? CourseStatusEnum.NOT_PLANNED,
    };
  });

  const parsedData = z.array(courseTableEntrySchema).safeParse(courseTableData);

  if (!parsedData.success) {
    return {
      success: false,
      error: parsedData.error.toString(),
    };
  }

  return {
    success: true,
    data: parsedData.data,
  };
}
