"use client";

import { ErrorIndicator } from "@/components/error-indicator";

export default function AssignmentsPageError({ error }: { error: Error }) {
  const { message } = error;

  return (
    <>
      <ErrorIndicator>Assignments Page Error: {message}</ErrorIndicator>
    </>
  );
}
