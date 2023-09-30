import { type Metadata } from "next/types";

import { ThemeCustomizer } from "@/app/(app)/(authenticated)/settings/(subpages)/appearance/theme-customizer";
import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

export const metadata: Metadata = {
  title: "Appearance",
};

export default function SettingsAppearancePage() {
  return (
    <SettingsSubpage
      title="Appearance"
      subtitle="Customize the appearance of the dashboard."
    >
      <ThemeCustomizer />
    </SettingsSubpage>
  );
}
