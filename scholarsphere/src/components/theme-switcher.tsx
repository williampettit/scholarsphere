"use client";

import * as React from "react";

import { useSelectedLayoutSegment } from "next/navigation";

import { useThemeConfig } from "@/hooks/use-theme-config";

export function ThemeSwitcher() {
  //
  const [themeConfig] = useThemeConfig();

  //
  const segment = useSelectedLayoutSegment();

  // this effect runs on client after component mounts
  React.useEffect(() => {
    // remove all theme classes from the body
    document.body.classList.forEach((className) => {
      // if the class name starts with theme, then remove it
      if (className.match(/^theme.*/)) {
        // remove the class name
        document.body.classList.remove(className);
      }
    });

    // if the current segment is themes, then set the theme
    const theme = segment === "themes" ? themeConfig.theme : null;

    // if the theme is set, then add the theme class to the body
    if (theme) {
      return document.body.classList.add(`theme-${theme}`);
    }
  }, [segment, themeConfig]);

  return null;
}
