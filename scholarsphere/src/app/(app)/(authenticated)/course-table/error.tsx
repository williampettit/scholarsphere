"use client";

import { ErrorIndicator } from "@/components/error-indicator";

export default function CourseTableError({ error }: { error: Error }) {
  const { message } = error;

  return (
    <>
      <ErrorIndicator>Course Table Error: {message}</ErrorIndicator>
    </>
  );
}
