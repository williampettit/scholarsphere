import { NextResponse } from "next/server";

import { S_getGpa } from "@/server/actions/get-gpa";

async function API_getUserGpa() {
  const { completedGpa, tenativeGpa } = await S_getGpa();

  return NextResponse.json(
    {
      completed_gpa: completedGpa,
      tenative_gpa: tenativeGpa,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export { API_getUserGpa as GET };
