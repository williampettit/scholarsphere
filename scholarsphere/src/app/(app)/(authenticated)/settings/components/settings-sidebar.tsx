"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { settingsSidebarNavLinks } from "@/config/site-config";
import { cn } from "@/lib/utils";

import { NewBadge } from "@/components/new-badge";
import { buttonVariants } from "@/components/ui/button";

export function SettingsSidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="-mx-4 lg:w-1/5">
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {Object.entries(settingsSidebarNavLinks).map(([key, item]) => (
          <Link
            key={key}
            href={item.url}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.url
                ? "bg-muted/80 hover:bg-muted/100"
                : "hover:bg-muted/50",
              "flex flex-row gap-1 lg:justify-between",
            )}
          >
            {item.label}

            {item.new && <NewBadge />}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
