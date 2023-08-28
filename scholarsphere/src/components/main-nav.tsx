"use client";

import Link from "next/link";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SiteLogoText } from "@/components/site-logo-text";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex gap-8">
      <Link
        href={siteConfig.links.dashboard}
        className="flex items-center space-x-2"
      >
        <SiteLogoText className="hidden sm:flex text-lg" />
      </Link>
      <nav className="flex items-center space-x-4 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === link.href ? "text-foreground" : "text-foreground/60"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
