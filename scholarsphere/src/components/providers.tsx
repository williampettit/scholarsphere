"use client";

import { SessionProvider } from "next-auth/react";

import { siteConfig } from "@/config/site-config";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <SessionProvider>
        <ThemeProvider
          storageKey={`${siteConfig.name}-ThemeStorageKey`}
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TooltipProvider>
            {children}
            <Toaster />
            <TailwindIndicator />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </SessionProvider>
    </>
  );
}
