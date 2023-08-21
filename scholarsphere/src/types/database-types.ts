import {
  type Assignment as AssignmentOriginal,
  type Course as CourseOriginal,
  type Semester as SemesterOriginal,
} from "@prisma/client";

import { CourseStatusString } from "@/app/(home)/(dashboard)/courses/data/schema";

export interface Course extends CourseOriginal {
  status: CourseStatusString;
}

export interface Semester extends SemesterOriginal {}

export interface Assignment extends AssignmentOriginal {}
