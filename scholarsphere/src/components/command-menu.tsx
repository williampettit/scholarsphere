"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { navLinks, settingsSidebarNavLinks } from "@/config/site-config";
import { DialogProps } from "@radix-ui/react-alert-dialog";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { type CourseBasicInfo } from "@/types/shared";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type CommandMenuProps = DialogProps & {
  activeCourses: Pick<CourseBasicInfo, "id" | "name">[];
};

export function CommandMenu({ activeCourses, ...props }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {Object.entries(navLinks).map(([key, navItem]) => (
              <CommandItem
                key={key}
                value={navItem.url}
                onSelect={() => {
                  runCommand(() => router.push(navItem.url));
                }}
              >
                <Icons.Page className="mr-2 h-4 w-4" />
                {navItem.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Active Courses">
            {activeCourses.map((course) => (
              <CommandItem
                key={course.id}
                value={course.id}
                onSelect={() => {
                  runCommand(() =>
                    router.push(`/course/${course.id}`, {
                      scroll: false,
                    }),
                  );
                }}
              >
                <Icons.Backpack className="mr-2 h-4 w-4" />
                {course.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            {Object.entries(settingsSidebarNavLinks).map(([key, navItem]) => (
              <CommandItem
                key={key}
                value={navItem.url}
                onSelect={() => {
                  runCommand(() => router.push(navItem.url));
                }}
              >
                <Icons.Settings className="mr-2 h-4 w-4" />
                {navItem.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Icons.LightTheme className="mr-2 h-4 w-4" />
              Light
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Icons.DarkTheme className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Icons.SystemTheme className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
