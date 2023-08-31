"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { settingsSidebarNavLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

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
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
