import { NextResponse } from "next/server";

import { S_getCredits } from "@/server/actions/get-credits";

async function API_getCredits() {
  const {
    attemptedCredits,
    passedCredits,
    inProgressCredits,
    plannedCredits,
    notPlannedCredits,
  } = await S_getCredits();

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
