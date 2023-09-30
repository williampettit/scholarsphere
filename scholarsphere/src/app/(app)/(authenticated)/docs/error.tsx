"use client";

import { ErrorIndicator } from "@/components/error-indicator";

export default function DocumentationPageError({ error }: { error: Error }) {
  const { message } = error;

  return (
    <>
      <ErrorIndicator>API Documentaiton Page Error: {message}</ErrorIndicator>
    </>
  );
}
