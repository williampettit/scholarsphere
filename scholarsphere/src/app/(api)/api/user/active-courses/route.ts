import { NextResponse } from "next/server";

import { S_getActiveCourses } from "@/server/actions/get-courses";

async function API_getActiveCourses() {
  const activeCourses = await S_getActiveCourses();

  return NextResponse.json(
    {
      active_courses: activeCourses.map((course) => ({
        name: course.name,
        short_id: course.shortId,
        status: course.status,
        credit_hours: course.creditHours,
        current_grade: course.currentGrade,
      })),
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export { API_getActiveCourses as GET };
