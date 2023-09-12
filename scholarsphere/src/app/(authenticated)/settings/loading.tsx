import { LoadingIndicator } from "@/components/loading-indicator";

import { Skeleton } from "@/components/ui/skeleton"

function BasicFormSkeleton() {
  return (
    <>
      <div className="flex items-center space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </>
  )
}

export default function LoadingSettings() {
  return (
    <>
      <BasicFormSkeleton />
    </>
  )
  
  return (
    <>
      <LoadingIndicator>
        Loading settings...
      </LoadingIndicator>
    </>
  );
}
