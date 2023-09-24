import { getGpaDiffProps } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStatsCardProps = {
  title: React.ReactNode;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
};

type DashboardStatsGpaCardProps = {
  completedGpa: number;
  tenativeGpa: number;
};

export function DashboardStatsCardSkeleton({
  title,
  value,
  description,
  icon,
}: Partial<DashboardStatsCardProps>) {
  return (
    <DashboardStatsCard
      title={title ?? <Skeleton className="h-6 w-[60px]" />}
      value={value ?? <Skeleton className="h-8 w-[80px]" />}
      description={description ?? <Skeleton className="h-4 w-[200px]" />}
      icon={icon ?? <Skeleton className="h-8 w-8" />}
    />
  );
}

export function DashboardStatsGpaCardSkeleton() {
  return (
    <DashboardStatsCardSkeleton
      title="GPA"
      icon={
        <Icons.GPA
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        />
      }
    />
  );
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon,
}: DashboardStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent className="flex flex-col space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardStatsGpaCard({
  completedGpa,
  tenativeGpa,
}: DashboardStatsGpaCardProps) {
  const gpaDiff = tenativeGpa - completedGpa;

  const { color: diffColor, sign: diffSign } = getGpaDiffProps(gpaDiff);

  return (
    <DashboardStatsCard
      title="GPA"
      value={completedGpa}
      description={
        <>
          <span className={diffColor}>{tenativeGpa}</span> after this semester (
          <span className={diffColor}>
            {`${diffSign}${gpaDiff.toFixed(2)}`}
          </span>
          )
        </>
      }
      icon={
        <Icons.GPA
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        />
      }
    />
  );
}
