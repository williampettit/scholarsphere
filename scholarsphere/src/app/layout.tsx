import "@/styles/globals.css";

import { type Metadata } from "next";
import {
  //// ** BEST **
  // Plus_Jakarta_Sans as PrimaryFont,
  Mulish as PrimaryFont,
  // Work_Sans as PrimaryFont,
  
  //// ** GOOD **
  // Inter as PrimaryFont,
  // Montserrat as PrimaryFont,
  // Nunito_Sans as PrimaryFont,
  // Rubik as PrimaryFont,
  // Inter_Tight as PrimaryFont,
  // Sora as PrimaryFont,
  // Chivo as PrimaryFont,

  //// ** DECENT **
  // Lexend as PrimaryFont,
  // EB_Garamond as PrimaryFont,
  // Epilogue as PrimaryFont,
  
  //// ** REQUIRES EXTRA CFG **
  // Bai_Jamjuree as PrimaryFont,
  // Poppins as PrimaryFont,
  // Monda as PrimaryFont,
} from "next/font/google";

import { siteConfig } from "@/lib/site-config";
import { type RootLayoutProps } from "@/types/root-layout";

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

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
