import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

interface DashboardHeaderProps {
  name: string;
}

function ChangelogLink() {
  return (
    <>
      <Link
        href={siteConfig.links.changelog}
        className="inline-flex items-center rounded-lg bg-muted px-3 py-1 mb-2 text-sm font-medium text-accent-foreground/80"
      >
        👋 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
        <span className="inline">Check out the latest site improvements!</span>
        <ArrowRightIcon className="ml-1 h-4 w-4" />
      </Link>
    </>
  );
}

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour > 23 || hour < 5) {
      return "Good night";
    } else if (hour < 12) {
      return "Good morning";
    } else if (hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  })();

  return (
    <>
      <div className="space-y-2">
        <ChangelogLink />

        <PageHeader>
          <PageHeaderTitle>
            {greeting}, {name.split(" ")[0]}
          </PageHeaderTitle>
          <PageHeaderSubtitle>
            Welcome to your dashboard. Here you can view your upcoming
            assignments for your active courses.
          </PageHeaderSubtitle>
        </PageHeader>
      </div>
    </>
  );
}
