import {
  type Assignment as AssignmentOriginal,
  type Course as CourseOriginal,
  type Semester as SemesterOriginal,
  type UserRole as UserRoleOriginal,
} from "@prisma/client";
import { type CourseStatusEnum } from "@/types/shared";

export type UserRole = UserRoleOriginal;

export interface Semester extends SemesterOriginal {}

export interface Assignment extends AssignmentOriginal {}

export interface Course extends CourseOriginal {
  status: CourseStatusEnum;
}
