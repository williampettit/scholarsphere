"use client";

import { buttonVariants } from "@/components/ui/button";
import { settingsSidebarNavItems } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {Object.entries(settingsSidebarNavItems).map(([key, item]) => (
          <Link
            key={key}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  );
}
