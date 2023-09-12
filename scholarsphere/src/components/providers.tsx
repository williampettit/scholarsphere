"use client";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "next-themes";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster />
            <TailwindIndicator />
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
