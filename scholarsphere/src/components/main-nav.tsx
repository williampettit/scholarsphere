"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/config/site-config";
import { cn } from "@/lib/utils";

import { SiteLogoTextLink } from "@/components/site-logo-text";

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden gap-8 md:flex">
        <SiteLogoTextLink className="hidden items-center space-x-2 text-lg sm:flex" />

        <nav className="flex items-center space-x-4 text-sm font-medium">
          {Object.entries(navLinks).map(([key, item]) => (
            <Link
              key={key}
              href={item.url}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.url
                  ? "text-foreground"
                  : "text-foreground/60",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
