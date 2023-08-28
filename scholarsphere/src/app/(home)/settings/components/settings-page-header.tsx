import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsSubpageHeaderProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export async function SettingsSubpageHeader({
  title,
  subtitle,
  children,
}: SettingsSubpageHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <Separator />

      <Suspense
        fallback={
          <div className="text-center text-muted-foreground text-sm">
            Loading suspense...
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
