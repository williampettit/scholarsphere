"use client";

import "@/styles/globals.css";

import { ErrorPage } from "@/components/error-page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <head />
      <body>
        <ErrorPage error={error} reset={reset} />
      </body>
    </html>
  );
}
