import { AppearanceForm } from "@/app/(authenticated)/settings/(subpages)/appearance/appearance-form";
import { SettingsSubpage } from "@/app/(authenticated)/settings/components/settings-subpage";

export default function SettingsAppearancePage() {
  return (
    <>
      <SettingsSubpage
        title="Appearance"
        subtitle="Customize the appearance of the dashboard."
      >
        <AppearanceForm />
      </SettingsSubpage>
    </>
  );
}
