import { S_requireUser } from "@/server/auth";

import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";
import { ProfileForm } from "@/app/(home)/settings/profile/profile-form";

export default async function SettingsProfilePage() {
  const { name } = await S_requireUser();

  return (
    <SettingsSubpageHeader
      title="Profile"
      subtitle="This is how others will see you on the site."
    >
      <ProfileForm
        initialData={{
          name: name,
        }}
      />
    </SettingsSubpageHeader>
  );
}
