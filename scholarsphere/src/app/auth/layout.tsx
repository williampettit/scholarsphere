import { Metadata } from "next";
import Image from "next/image";

import { RootLayoutProps } from "@/types/root-layout";
import { siteConfig } from "@/config/site";
import { Globe } from "./components/globe";

export const metadata: Metadata = {
  title: "Authentication",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const showGlobe = true;

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
              <div className="absolute inset-0 bg-zinc-900">
                {showGlobe ? (
                  <Globe />
                ) : (
                  <Image
                    src="/patrick-robert-doyle-OvXht_wi5Ew-unsplash.jpg"
                    alt="Hero"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="left"
                    className="opacity-50"
                  />
                )}
              </div>

              <div className="relative z-20 flex items-center text-xl font-bold tracking-tigh">
                {siteConfig.name}
              </div>

              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg">
                    &ldquo;{siteConfig.name} has been a lifesaver... I can now
                    keep track of all my classes and assignments in one place. I
                    love the ability to plan out my future semesters and see
                    what classes I need to take, no other app has this
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
    </>
  );
}
