import {
  DEFAULT_FONT_KEY,
  FONT_COOKIE_NAME,
  FONT_MAP,
  FontKey,
} from "@/styles/fonts";
import "@/styles/globals.css";
import "@/styles/themes.css";

import { type Metadata } from "next";
import { cookies } from "next/headers";

import { siteConfig } from "@/config/site-config";
import { type RootLayoutProps } from "@/types/layout";

import { Providers } from "@/components/providers";

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

export default function RootLayout({ children }: RootLayoutProps) {
  // get cookie store
  const cookieStore = cookies();

  // get selected font cookie
  const fontCookie = cookieStore.get(FONT_COOKIE_NAME);

  // get font key
  const fontKey = (fontCookie?.value ?? DEFAULT_FONT_KEY) as FontKey;

  // get font data
  const fontData = FONT_MAP[fontKey];

  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontData.url} />
      </head>

      <body
        style={{
          ...fontData.style,
        }}
      >
        <Providers
          cookieProviderProps={{
            value: cookieStore.getAll(),
          }}
        >
          <div
            className="
              relative 
              flex 
              min-h-screen 
              flex-col 
              bg-background 
            "
          >
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
