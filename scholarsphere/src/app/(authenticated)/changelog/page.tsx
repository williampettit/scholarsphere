import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Changelog",
};

export default function ChangelogPage() {
  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Changelog</h2>
        <p className="text-muted-foreground">
          Read about the latest updates to {siteConfig.name}.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">January 1, 1970</h3>
              <p className="text-sm text-muted-foreground">
                This is what was changed on January 1, 1970.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
