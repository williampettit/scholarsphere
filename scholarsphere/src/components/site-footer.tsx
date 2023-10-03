import Link from "next/link";

import { siteConfig } from "@/config/site-config";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between md:h-24 md:flex-row">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <span>
            {siteConfig.name} by{" "}
            <Link
              href={siteConfig.author.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-foreground underline underline-offset-4"
            >
              {siteConfig.author.name}
            </Link>
            .{" "}
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-foreground underline underline-offset-4"
            >
              Open Source
            </Link>{" "}
            (MIT License).
          </span>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
            Not affiliated with nor endorsed by any universities.
          </p>

          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
