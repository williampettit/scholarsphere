import { AppearanceForm } from "@/app/(home)/(dashboard)/settings/appearance/appearance-form";
import { SettingsSubpageHeader } from "@/app/(home)/(dashboard)/settings/components/settings-page-header";

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
