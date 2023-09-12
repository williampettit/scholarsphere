import dayjs from "dayjs";

import { CourseStatusEnum, type Semester } from "@/types/shared";

export function _mapSemestersWithStatus(semesters: Omit<Semester, "userId">[]) {
  return semesters.map((semester) => ({
    ...semester,
    status: ((): CourseStatusEnum => {
      if (dayjs().isAfter(semester.endDate)) {
        // end date is in the past
        return CourseStatusEnum.COMPLETED;
      } else if (dayjs().isBefore(semester.startDate)) {
        // start date is in the future
        return CourseStatusEnum.PLANNED;
      } else if (dayjs().isBefore(semester.endDate)) {
        // start date is in the past and end date is in the future
        return CourseStatusEnum.IN_PROGRESS;
      } else {
        // start date is in the past and end date is in the past
        return CourseStatusEnum.COMPLETED;
      }
    })(),
  }));
}
