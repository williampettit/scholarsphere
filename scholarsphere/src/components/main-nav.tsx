"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks, siteMap } from "@/config/site";
import { cn } from "@/lib/utils";

import { SiteLogoText } from "@/components/site-logo-text";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden gap-8 md:flex">
      <Link
        href={siteMap.dashboard.url}
        className="flex items-center space-x-2"
      >
        <SiteLogoText className="hidden text-lg sm:flex" />
      </Link>
      <nav className="flex items-center space-x-4 text-sm font-medium">
        {Object.entries(navLinks).map(([key, item]) => (
          <Link
            key={key}
            href={item.url}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.url ? "text-foreground" : "text-foreground/60",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
