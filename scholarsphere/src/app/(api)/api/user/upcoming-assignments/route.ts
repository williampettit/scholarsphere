import { NextResponse } from "next/server";

import { S_getUpcomingAssignments } from "@/server/actions/get-assignments";

async function API_getUserAssignments() {
  const getUserUpcomingAssignmentsResponse = await S_getUpcomingAssignments();

  if (!getUserUpcomingAssignmentsResponse.success) {
    throw new Error(getUserUpcomingAssignmentsResponse.error);
  }

  const { data: upcomingAssignments } = getUserUpcomingAssignmentsResponse;

  return NextResponse.json(
    {
      upcoming_assignments: upcomingAssignments.map((assignment) => ({
        title: assignment.title,
        course: assignment.course.name,
        due_date: assignment.dueDate,
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

export { API_getUserAssignments as GET };
