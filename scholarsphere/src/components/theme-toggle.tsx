"use client";

import { useTheme } from "next-themes";

import { Icons } from "@/components/icons";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeToggleProps = ButtonProps & {
  // ...
};

export function ThemeToggle({ ...props }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 px-0" {...props}>
          <Icons.LightTheme
            className="
              h-[1.2rem] 
              w-[1.2rem] 
              rotate-0 
              scale-100 
              transition-all 
              dark:-rotate-90 
              dark:scale-0 
            "
          />

          <Icons.DarkTheme
            className="
              absolute 
              h-[1.2rem] 
              w-[1.2rem] 
              rotate-90 
              scale-0 
              transition-all 
              dark:rotate-0 
              dark:scale-100 
            "
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
