import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";

type ErrorIndicatorProps = {
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
};

export function ErrorIndicator({
  children,
  className,
  showIcon = true,
}: ErrorIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-sm font-bold text-destructive",
        className,
      )}
    >
      {showIcon && <Icons.ErrorCircle strokeWidth={2.5} className="h-4 w-4" />}

      {children ?? <>An unknown error has occured.</>}
    </div>
  );
}
