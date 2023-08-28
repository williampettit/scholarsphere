import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left items-center">
          Built by{" "}
          <Link
            href={siteConfig.social.author}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 text-accent-foreground"
          >
            {siteConfig.author}
          </Link>
          . Fully open-source under the MIT license.
        </p>
        <div className="flex gap-4 items-center">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
            Not affiliated with nor endorsed by any universities.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
