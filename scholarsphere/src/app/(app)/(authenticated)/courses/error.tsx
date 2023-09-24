"use client";

import { ErrorIndicator } from "@/components/error-indicator";

export default function CoursesPageError({ error }: { error: Error }) {
  const { message } = error;

  return (
    <>
      <ErrorIndicator>Courses Page Error: {message}</ErrorIndicator>
    </>
  );
}
