"use server";

import { z } from "zod";
import { S_getUserData } from "@/server/actions/get-user-data";
import { courseTableEntrySchema } from "@/types/shared";

export async function S_getCourseTableData() {
  const userData = await S_getUserData();
  if (!userData) {
    return null;
  }
  const courseTableData = userData.courses.map((course) => {
    const semester = userData.semesters.find(
      (semester) => semester.id === course.semesterId
    );
    return {
      ...course,
      semester: semester,
      status: semester?.status,
    };
  });
  return z.array(courseTableEntrySchema).parse(courseTableData);
}
