import { Skeleton } from "@/components/ui/skeleton";

import { SettingsSubpage } from "@/app/(authenticated)/settings/components/settings-subpage";

export default function LoadingSettings() {
  return (
    <>
      <SettingsSubpage>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[400px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>

          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[400px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>

          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-6 w-[400px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      </SettingsSubpage>
    </>
  );
}
