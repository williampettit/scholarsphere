import { prisma } from "./db";
import {
  fixCourseFinalGpa,
  fixDate,
  getMockData,
  getUserByEmail,
  resetUserById,
} from "./utils";

async function main() {
  // Get mock data
  const { mockCourseCatalogData, mockUserData } = getMockData();

  // Find user ID of my account
  const user = await getUserByEmail(mockUserData.email);

  // Reset my account
  console.log("\nResetting user");
  await resetUserById(user.id);

  // Create all semesters
  for (const semester of mockUserData.semesters) {
    console.log("\n.... Creating semester", semester.name);

    // Create semester
    const newSemester = await prisma.semester.create({
      data: {
        name: semester.name,
        startDate: fixDate(semester.startDate),
        endDate: fixDate(semester.endDate),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Add all courses to semester
    for (const [courseShortId, courseFinalGpa] of Object.entries(
      semester.courses
    )) {
      console.log("........ Creating course", courseShortId);

      // Find course in catalog
      const course = mockCourseCatalogData[courseShortId];

      // Create course and link to user/semester
      await prisma.course.create({
        data: {
          name: course.title,
          creditHours: course.credits,
          currentGrade: fixCourseFinalGpa(courseFinalGpa),
          shortId: courseShortId,
          user: {
            connect: {
              id: user.id,
            },
          },
          semester: {
            connect: {
              id: newSemester.id,
            },
          },
        },
      });
    }
  }

  //
  // Done
  //
}

main()
  .then(() => console.log("Seed (min) complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
