import Link from "next/link";

import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";

type SiteLogoTextProps = {
  className?: string;
};

export function SiteLogoTextLink({ ...props }: SiteLogoTextProps) {
  return (
    <Link href="/">
      <SiteLogoText {...props} />
    </Link>
  );
}

export function SiteLogoText({ className, ...props }: SiteLogoTextProps) {
  return (
    <span
      className={cn(
        "flex items-center text-xl font-bold tracking-tight text-accent-foreground",
        className,
      )}
      {...props}
    >
      {siteConfig.name}
    </span>
  );
}
