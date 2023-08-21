import { Separator } from "@/components/ui/separator";

export function SettingsSubpageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Separator />
      {children}
    </div>
  );
}
