import { Separator } from "@/components/ui/separator";

type PageHeaderSubtitleProps = {
  children: React.ReactNode;
};

type PageHeaderTitleProps = {
  children: React.ReactNode;
};

type PageHeaderProps = {
  children: React.ReactNode;
};

export function PageHeaderTitle({ children }: PageHeaderSubtitleProps) {
  return <h2 className="text-2xl font-bold tracking-tight">{children}</h2>;
}

export function PageHeaderSubtitle({ children }: PageHeaderTitleProps) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">{children}</div>
      <Separator />
    </div>
  );
}
