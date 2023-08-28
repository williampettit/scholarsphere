import { type Metadata } from "next";
import { type RootLayoutProps } from "@/types/root-layout";
import { siteConfig } from "@/config/site";
import { Globe } from "@/app/auth/components/globe";
import { SiteLogoText } from "@/components/site-logo-text";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Authentication",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
              <div className="absolute inset-0 bg-zinc-900">
                <Globe className="animate-fade-in" />
              </div>

              <SiteLogoText className="relative z-20 text-2xl" />

              <div
                className="relative
                  z-20
                  w-full
                  mt-auto 
                  p-6
                  bg-blur
                  backdrop-blur
                  supports-backdrop-blur:bg-background/60
                  rounded-lg
                  border-transparent/50
                  bg-orange-600/10
                  shadow-lg
                "
              >
                <blockquote className="space-y-2">
                  <p className="text-md text-justify">
                    &ldquo;<b>{siteConfig.name}</b> has been a lifesaver... I
                    can now keep track of all my classes and assignments in one
                    place. I love the ability to plan out my future semesters
                    and see what classes I need to take, no other app has this
                    feature.&rdquo;
                  </p>

                  <footer className="text-sm">
                    <cite className="not-italic font-bold">
                      &mdash; John Doe, Student at University of Lorem Ipsum
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          fixed
          bottom-1
          right-1
          z-5000
          flex
          items-center
          justify-center
        "
      >
        <ThemeToggle />
      </div>
    </>
  );
}
