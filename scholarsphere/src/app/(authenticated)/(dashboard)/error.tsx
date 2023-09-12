"use client";

import { ErrorIndicator } from "@/components/error-indicator";

export default function DashboardError({ error }: { error: Error }) {
  const { message } = error;

  return (
    <>
      <ErrorIndicator>{message}</ErrorIndicator>
    </>
  );
}
