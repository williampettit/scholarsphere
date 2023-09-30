"use client";

import React, { useEffect } from "react";

import { SessionProvider } from "next-auth/react";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import { useAtom } from "jotai";
import { CookiesProvider } from "next-client-cookies";
import { ThemeProvider } from "next-themes";

import { siteConfig } from "@/config/site-config";
import { loadingThemeConfigAtom } from "@/hooks/use-theme-config";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const THEME_PROVIDER_STORAGE_KEY: string = `${siteConfig.name}-theme` as const;

type ProvidersProps = {
  children: React.ReactNode;
  cookieProviderProps: Pick<
    React.ComponentProps<typeof CookiesProvider>,
    "value"
  >;
};

export function Providers({ children, cookieProviderProps }: ProvidersProps) {
  return (
    <CookiesProvider {...cookieProviderProps}>
      <SessionProvider>
        <ThemeProviders>{children}</ThemeProviders>
        <VercelAnalytics />
      </SessionProvider>
    </CookiesProvider>
  );
}

type ThemeProvidersProps = {
  children: React.ReactNode;
};

function ThemeProviders({ children }: ThemeProvidersProps) {
  const [isLoadingThemeConfig, setLoadingThemeConfig] = useAtom(
    loadingThemeConfigAtom,
  );

  // this effect runs on client after component mounts
  useEffect(() => {
    // read theme config from local storage
    const storedThemeConfig = localStorage.getItem("theme-config");

    //
    if (storedThemeConfig) {
      console.log("got stored config:\n", JSON.parse(storedThemeConfig));
    }

    // set loading to false once the local storage has been read
    setLoadingThemeConfig(false);
  }, []);

  // don't render anything until the theme config has been read from local storage
  if (isLoadingThemeConfig) {
    return null;
  }

  return (
    <ThemeWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        storageKey={THEME_PROVIDER_STORAGE_KEY}
        enableSystem
        enableColorScheme
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>

      <ThemeSwitcher />
      <Toaster />
      <TailwindIndicator />
    </ThemeWrapper>
  );
}
