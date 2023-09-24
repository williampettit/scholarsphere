"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { ErrorIndicator } from "@/components/error-indicator";
import { SiteLogoTextLink } from "@/components/site-logo-text";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);

  const router = useRouter();

  const errorName = error.name ?? "Error";
  const errorMessage = error.message ?? "Unknown";

  // TODO: better method for error details
  const errorDetails = JSON.stringify(
    {
      errorName,
      errorMessage,
      ...JSON.parse(JSON.stringify(error, null, 2)),
    },
    null,
    2,
  );

  return (
    <>
      <div
        className="
          m-auto  
          flex
          w-3/5
          flex-col
          items-center
          justify-center
          space-y-16
          p-16
        "
      >
        <SiteLogoTextLink className="text-6xl" />

        <Separator />

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            space-y-2
            text-destructive
          "
        >
          <h2 className="text-2xl font-bold">Something went wrong!</h2>

          <ErrorIndicator className="text-md" showIcon={false}>
            {errorName}: {errorMessage}
          </ErrorIndicator>
        </div>

        <div className="flex flex-row items-center space-x-2">
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>

          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>

        <Separator />

        <Collapsible
          open={showDetails}
          onOpenChange={setShowDetails}
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                {showDetails ? (
                  <>Hide Error Details</>
                ) : (
                  <>Show Error Details</>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="w-full space-y-2">
            <div className="overflow-scroll rounded-md border p-4 shadow-sm">
              <CopyButton
                value={errorDetails}
                className="
                  float-right
                  -mr-1
                  -mt-1
                "
              />

              <span className="whitespace-pre font-mono text-sm text-red-500">
                {errorDetails}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
