import { prisma } from "./db";
import { fixDate, getUserByEmail } from "./utils";
import mockData from "../../../scripts/mock_user_data.json";

async function main() {
  //
  throw new Error("This has been replaced now; see 'seed-min.ts'");

  // Find user ID of my account
  const user = await getUserByEmail(mockData.email);

  //
  // Create all semesters
  //

  let oldSemesterIdToNewMapping = new Map<string, string>();

  const semesterValues = Object.values(mockData.semesters);

  const blah = semesterValues.map(async (semester) => {
    console.log("Creating a semester!");

    const newSemester = await prisma.semester.create({
      data: {
        name: "Semester Name",
        startDate: fixDate(semester.start_date),
        endDate: fixDate(semester.end_date),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const oldSemesterId = semester.id;

    const newSemesterId = newSemester.id;

    oldSemesterIdToNewMapping.set(oldSemesterId, newSemesterId);

    return {
      old: oldSemesterId,
      new: newSemesterId,
    };
  });

  await Promise.all(blah);

  console.log("oldSemesterIdToNewMapping", oldSemesterIdToNewMapping);

  //
  // Create all cousres and link them to their semesters
  //

  Object.values(mockData.courses).forEach(async (course) => {
    const newCourse = await prisma.course.create({
      data: {
        name: course.title,
        description: course.description,
        creditHours: course.credit_hours,
        currentGrade: course.grade,
        shortId: course.short_id,
        user: {
          connect: {
            id: user.id,
          },
        },
        semester: {
          connect: {
            id: oldSemesterIdToNewMapping.get(course.connected_semester_id),
          },
        },
      },
    });

    //
    // Create all assignments for this course and link them
    //

    Object.values(course.assignments).forEach(async (assignment) => {
      await prisma.assignment.create({
        data: {
          title: assignment.title,
          dueDate: fixDate(assignment.due_date),
          isComplete: assignment.completed,
          user: {
            connect: {
              id: user.id,
            },
          },
          course: {
            connect: {
              id: newCourse.id,
            },
          },
        },
      });
    });
  });

  //
  // Done
  //
}

main()
  .then(() => console.log("Seed (full) complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
