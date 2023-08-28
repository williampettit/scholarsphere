import { ProfileForm } from "@/app/(home)/settings/profile/profile-form";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";
import { S_getUser } from "@/server/auth";

export default async function SettingsProfilePage() {
  const { name } = await S_getUser();
  return (
    <SettingsSubpageHeader
      title="Profile"
      subtitle="This is how others will see you on the site."
    >
      <ProfileForm
        initialData={{
          name,
        }}
      />
    </SettingsSubpageHeader>
  );
}
