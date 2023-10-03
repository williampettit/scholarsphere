import "@/styles/globals.css";
import "@/styles/themes.css";

import { type Metadata } from "next";
import { cookies } from "next/headers";

import { siteConfig } from "@/config/site-config";
import {
  DEFAULT_FONT_KEY,
  FONT_COOKIE_NAME,
  FONT_MAP,
  type FontKey,
} from "@/styles/fonts";
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
};

function extractFontKeyFromCookie(cookieValue: string | undefined): FontKey {
  const fontKey = cookieValue;

  if (fontKey && Object.keys(FONT_MAP).includes(fontKey)) {
    return fontKey as FontKey;
  }

  return DEFAULT_FONT_KEY;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // get font key from cookie
  const cookieStore = cookies();
  const fontCookie = cookieStore.get(FONT_COOKIE_NAME);
  const fontKey = extractFontKeyFromCookie(fontCookie?.value);
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

      <body style={fontData.style}>
        <Providers cookies={cookieStore.getAll()}>
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
