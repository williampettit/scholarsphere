"use client";

import { useThemeConfig } from "@/hooks/use-theme-config";
import { cn } from "@/lib/utils";

type ThemeWrapperProps = {
  children: React.ReactNode;
};

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [themeConfig] = useThemeConfig();

  return (
    <div
      className={cn(`theme-${themeConfig.theme}`, "w-full")}
      style={
        {
          "--radius": `${themeConfig.radius}rem`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
