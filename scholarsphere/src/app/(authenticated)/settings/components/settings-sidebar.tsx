"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { settingsSidebarNavLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function SettingsSidebarNavItems() {
  const pathname = usePathname();

  return (
    <>
      {Object.entries(settingsSidebarNavLinks).map(([key, item]) => (
        <Link
          key={key}
          href={item.url}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.url
              ? "bg-muted/80 hover:bg-muted/100"
              : "hover:bg-muted/50",
            "flex flex-row gap-2 lg:justify-between",
          )}
        >
          {item.label}

          {item.new ? <Badge>New</Badge> : null}
        </Link>
      ))}
    </>
  );
}
