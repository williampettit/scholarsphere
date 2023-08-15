import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/user-nav";

export function SiteHeader() {
  return (
    <header
      className="
      sticky
      top-0
      w-full
      z-50
      supports-backdrop-blur:bg-background/60
      border-b
      backdrop-blur
      bg-background/80
      bg-none
    "
    >
      <div className="container flex items-center h-16">
        <MainNav />

        <MobileNav />

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {/* <Link
              href={siteConfig.miscLinks.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    // variant: "ghost",
                    variant: "outline",
                    size: "icon",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link> */}

            {/* <ModeToggle /> */}

            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
