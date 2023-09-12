import { RootLayoutProps } from "@/types/root-layout";

import { SettingsSubpage } from "@/app/(authenticated)/settings/components/settings-subpage";

export default function SettingsProfileLayout({ children }: RootLayoutProps) {
  return (
    <SettingsSubpage
      title="Profile"
      subtitle="This is how others will see you on the site."
    >
      {children}
    </SettingsSubpage>
  );
}
