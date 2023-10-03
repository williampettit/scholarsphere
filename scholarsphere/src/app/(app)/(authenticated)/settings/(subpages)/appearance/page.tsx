import { type Metadata } from "next/types";

import { siteConfig } from "@/config/site-config";

import { ThemeCustomizer } from "@/app/(app)/(authenticated)/settings/(subpages)/appearance/theme-customizer";
import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

export const metadata: Metadata = {
  title: "Appearance",
};

export default function SettingsAppearancePage() {
  return (
    <SettingsSubpage
      title="Appearance"
      subtitle={`Fine-tune the appearance of ${siteConfig.name} to your liking here.`}
    >
      <ThemeCustomizer />
    </SettingsSubpage>
  );
}
