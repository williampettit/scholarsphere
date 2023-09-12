import { NextResponse } from "next/server";

import { S_getCredits } from "@/server/actions/get-gpa";

async function API_getCredits() {
  const getCreditsResponse = await S_getCredits();

  if (!getCreditsResponse.success) {
    throw new Error(getCreditsResponse.error);
  }

  const {
    attemptedCredits,
    passedCredits,
    inProgressCredits,
    plannedCredits,
    notPlannedCredits,
  } = getCreditsResponse.data;

  return NextResponse.json(
    {
      attempted_credits: attemptedCredits,
      passed_credits: passedCredits,
      in_progress_credits: inProgressCredits,
      planned_credits: plannedCredits,
      not_planned_credits: notPlannedCredits,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export { API_getCredits as GET };
