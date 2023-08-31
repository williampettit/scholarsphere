"use server";

import { GPA } from "@/lib/gpa";
import { withinNDays } from "@/lib/utils";
import { type Course, type Semester } from "@/types/database-types";
import { CourseStatusEnum } from "@/types/shared";

import { _mapSemestersWithStatus } from "@/server/actions/utils";
import { S_requireUserId } from "@/server/auth";
import prisma from "@/server/prisma";

import { type AssignmentListItem } from "@/app/(home)/components/assignment-list";

export interface DashboardDataProps {
  tenativeGpa: GPA;
  completedGpa: GPA;

  allSemesters: Pick<Semester, "id" | "name" | "startDate">[];
  activeCourses: Course[];
  upcomingAssignments: AssignmentListItem[];

  numPlannedCourses: number;
  numSemesterCredits: number;
  numCompletedCredits: number;
  numCompletedCourses: number;
  numPlannedSemesters: number;
}

interface DashboardDataReduceProps extends DashboardDataProps {
  plannedSemesterIds: Semester["id"][];
}

export async function S_getDashboardData(): Promise<DashboardDataProps> {
  const userId = await S_requireUserId();

  // get all courses and semesters for user
  const { courses, semesters } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      semesters: true,
      courses: {
        include: {
          assignments: true,
        },
      },
    },
  });

  // map semesters to include status
  const semestersWithStatus = _mapSemestersWithStatus(semesters);

  const reducedData = courses.reduce<DashboardDataReduceProps>(
    (acc, courseEntry) => {
      const courseStatus =
        semestersWithStatus.find(
          (semester) => semester.id === courseEntry.semesterId,
        )?.status ?? CourseStatusEnum.NOT_PLANNED;

      switch (courseStatus) {
        // count completed courses and credits
        case CourseStatusEnum.COMPLETED: {
          acc.completedGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.numCompletedCredits += courseEntry.creditHours;
          acc.numCompletedCourses += 1;
          break;
        }

        // count active courses, credits, and upcoming assignments
        case CourseStatusEnum.IN_PROGRESS: {
          acc.tenativeGpa.addCourse({
            grade: courseEntry.currentGrade,
            creditHours: courseEntry.creditHours,
          });
          acc.numSemesterCredits += courseEntry.creditHours;
          acc.activeCourses.push({
            ...courseEntry,
            status: courseStatus,
          });
          courseEntry.assignments.reduce((acc, assignment) => {
            if (
              assignment.dueDate &&
              !assignment.isComplete &&
              withinNDays(assignment.dueDate)
            ) {
              acc.upcomingAssignments.push({
                ...assignment,
                courseTitle: courseEntry.name,
              });
            }
            return acc;
          }, acc);
          break;
        }

        // count planned courses
        case CourseStatusEnum.PLANNED: {
          if (courseEntry.semesterId) {
            acc.numPlannedCourses += 1;
            if (!acc.plannedSemesterIds.includes(courseEntry.semesterId)) {
              acc.plannedSemesterIds.push(courseEntry.semesterId);
            }
          }
          break;
        }
      }

      return acc;
    },
    {
      tenativeGpa: new GPA(),
      completedGpa: new GPA(),
      numPlannedCourses: 0,
      numSemesterCredits: 0,
      numCompletedCourses: 0,
      numCompletedCredits: 0,
      numPlannedSemesters: 0,
      activeCourses: [],
      plannedSemesterIds: [],
      upcomingAssignments: [],
      allSemesters: semesters.map((semester) => ({
        id: semester.id,
        name: semester.name,
        startDate: semester.startDate,
      })),
    },
  );

  const { plannedSemesterIds, ...otherReducedData } = reducedData;

  return {
    ...otherReducedData,
    numPlannedSemesters: plannedSemesterIds.length,
  };
}
