"use client";

import { useState } from "react";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { navLinks, siteMap } from "@/config/site-config";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { SiteLogoText } from "@/components/site-logo-text";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type MobileLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="
              px-0 
              text-base 
              hover:bg-transparent 
              focus-visible:bg-transparent 
              focus-visible:ring-0 
              focus-visible:ring-offset-0 
              md:hidden 
            "
          >
            <Icons.ViewVertical
              className="
                h-5 
                w-5 
              "
            />

            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="
            flex
            flex-col
            space-y-4
            pr-0
          "
        >
          <MobileLink
            href={siteMap.dashboard.url}
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <SiteLogoText />
          </MobileLink>

          <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col space-y-4">
              {Object.entries(navLinks).map(([key, item]) => (
                <MobileLink key={key} href={item.url} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
