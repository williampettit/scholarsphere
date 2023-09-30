import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type SettingsSubpageProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
};

export function SettingsSubpage({
  title,
  subtitle,
  children,
  className,
}: SettingsSubpageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {title ? (
          <h3 className="text-lg font-medium">{title}</h3>
        ) : (
          <Skeleton className="h-6 w-[100px]" />
        )}

        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : (
          <Skeleton className="h-4 w-[250px]" />
        )}
      </div>

      <Separator />

      <div className={cn("flex flex-col space-y-6", className)}>{children}</div>
    </div>
  );
}
