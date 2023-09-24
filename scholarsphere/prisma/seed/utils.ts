import { prismaClient } from "./db";
import {
  type CourseFinalGpaType,
  MOCK_COURSE_CATALOG_DATA,
  MOCK_USER_DATA,
} from "./mock-data";

export function fixDate(date: string) {
  return new Date(date).toISOString();
}

export function fixCourseFinalGpa(courseFinalGpa: CourseFinalGpaType) {
  switch (courseFinalGpa) {
    case 4.0:
      return 95.0;
    case 3.0:
      return 85.0;
    case 2.0:
      return 75.0;
    case 1.0:
      return 65.0;
    case 0.0:
      return 0.0;
    default:
      throw new Error("Invalid course final GPA");
  }
}

export function getMockData() {
  return {
    mockCourseCatalogData: MOCK_COURSE_CATALOG_DATA,
    mockUserData: MOCK_USER_DATA,
  } as const;
}

export async function getUserByEmail(email: string) {
  return prismaClient.user.findUniqueOrThrow({
    where: { email },
  });
}

export async function resetUserById(userId: string) {
  // Delete all existing assignments
  await prismaClient.assignment.deleteMany({
    where: {
      user: {
        id: userId,
      },
    },
  });

  // Delete all existing courses
  await prismaClient.course.deleteMany({
    where: {
      user: {
        id: userId,
      },
    },
  });

  // Delete all existing semesters
  await prismaClient.semester.deleteMany({
    where: {
      user: {
        id: userId,
      },
    },
  });
}
