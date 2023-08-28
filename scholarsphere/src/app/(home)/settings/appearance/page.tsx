import { AppearanceForm } from "@/app/(home)/settings/appearance/appearance-form";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";

export default function SettingsAppearancePage() {
  return (
    <SettingsSubpageHeader
      title="Appearance"
      subtitle="Customize the appearance of the dashboard."
    >
      <AppearanceForm />
    </SettingsSubpageHeader>
  );
}
