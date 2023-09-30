import Link from "next/link";

import { siteMap } from "@/config/site-config";

import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";
import { Separator } from "@/components/ui/separator";

import { Greeting } from "@/app/(app)/(authenticated)/(dashboard)/components/greeting";

type DashboardHeaderProps = {
  userDisplayName: string;
};

function ChangelogLink() {
  return (
    <Link
      href={siteMap.changelog.url}
      className="
        inline-flex 
        items-center 
        rounded-lg 
        bg-muted 
        px-3 
        py-1 
        text-sm 
        font-medium 
        text-accent-foreground/80 
      "
    >
      <span>👋</span>

      <Separator className="mx-2 h-4" orientation="vertical" />

      <span>Check out the latest site improvements!</span>

      <Icons.ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}

export function DashboardHeader({ userDisplayName }: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      <ChangelogLink />

      <PageHeader>
        <PageHeaderTitle>
          <Greeting name={userDisplayName} />
        </PageHeaderTitle>

        <PageHeaderSubtitle>
          Welcome to your dashboard. Here you can view your upcoming assignments
          for your active courses.
        </PageHeaderSubtitle>
      </PageHeader>
    </div>
  );
}
