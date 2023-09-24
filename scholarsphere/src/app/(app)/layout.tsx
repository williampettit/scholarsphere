import "@/styles/globals.css";

import { type Metadata } from "next";
import {
  /* best */
  Inter as PrimaryFont,
  /* good */
  // Chivo as PrimaryFont,
  // Work_Sans as PrimaryFont,
  // Plus_Jakarta_Sans as PrimaryFont,
  // Nunito_Sans as PrimaryFont,
  // Rubik as PrimaryFont,
  // Inter_Tight as PrimaryFont,
  // Sora as PrimaryFont,
  // Montserrat as PrimaryFont,
  // Mulish as PrimaryFont,

  /* decent */
  // Lexend as PrimaryFont,
  // EB_Garamond as PrimaryFont,
  // Epilogue as PrimaryFont,
} from "next/font/google";

import { siteConfig } from "@/config/site-config";

import { type RootLayoutProps } from "@/types/layout";

import { Providers } from "@/components/providers";

const primaryFont = PrimaryFont({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s – ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],

  // twitter: {
  //   card: "app",
  //   title: siteConfig.name,
  //   site: "TODO",
  //   description: siteConfig.description,
  // },
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <body className={primaryFont.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
