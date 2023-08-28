"use server";

import dayjs from "dayjs";
import { GPA } from "@/lib/gpa";
import { S_getUserData } from "@/server/actions/get-user-data";
import { type AssignmentListItem } from "@/app/(home)/components/assignment-list";
import { type Course, type Semester } from "@/types/database-types";
import { CourseStatusEnum } from "@/types/shared";

export interface DashboardDataProps {
  upcomingAssignments: AssignmentListItem[];
  activeCourses: Course[];
  numCompletedCourses: number;
  numCompletedCredits: number;
  numSemesterCredits: number;
  numPlannedCourses: number;
  plannedSemesterIds: Semester["id"][];
  completedGpa: GPA;
  tenativeGpa: GPA;
}

export async function S_getDashboardData(): Promise<DashboardDataProps> {
  const userData = await S_getUserData();
  if (!userData) {
    throw new Error("User data not found");
  }
  return userData.courses.reduce<DashboardDataProps>(
    (acc, courseEntry) => {
      const courseStatus = userData.semesters.find(
        (semester) => semester.id === courseEntry.semesterId
      )?.status;

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
              !dayjs().isBefore(assignment.dueDate, "month")
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
      upcomingAssignments: [],
      plannedSemesterIds: [],
      activeCourses: [],

      numCompletedCourses: 0,
      numCompletedCredits: 0,
      numSemesterCredits: 0,
      numPlannedCourses: 0,

      completedGpa: new GPA(),
      tenativeGpa: new GPA(),
    }
  );
}
