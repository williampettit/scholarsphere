import "@/app/globals.css";

import { type Metadata } from "next";
import {
  // ** GOOD **
  // Inter as PrimaryFont,
  // Poppins as PrimaryFont,
  // Montserrat as PrimaryFont,
  // Nunito_Sans as PrimaryFont,
  // Rubik as PrimaryFont,
  Work_Sans as PrimaryFont, // Inter_Tight as PrimaryFont,
  // Epilogue as PrimaryFont,
  // Sora as PrimaryFont,
  // EB_Garamond as PrimaryFont,
  // Mulish as PrimaryFont,
  // Plus_Jakarta_Sans as PrimaryFont,
  // Chivo as PrimaryFont,
  // Lexend as PrimaryFont,
  // ** BROKEN **
  // Bai_Jamjuree as PrimaryFont,
  // Monda as PrimaryFont,
} from "next/font/google";

import { siteConfig } from "@/config/site";
import { type RootLayoutProps } from "@/types/root-layout";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/providers/tooltip-provider";

const primaryFont = PrimaryFont({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  description: siteConfig.description,
  title: {
    default: siteConfig.name,
    template: `%s – ${siteConfig.name}`,
  },
  // twitter: {
  //   card: "app",
  //   title: siteConfig.name,
  //   site: "TODO",
  //   description: siteConfig.description,
  // },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className={primaryFont.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
              <Toaster />
              <TailwindIndicator />
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
