import { ProfileForm } from "@/app/(home)/settings/profile-form";
import { mockGetUserData } from "@/data/mock-data";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";

export default async function SettingsProfilePage() {
  const userData = await mockGetUserData();

  return (
    <SettingsSubpageHeader
      title="Profile"
      subtitle="This is how others will see you on the site."
    >
      <ProfileForm userData={userData} />
    </SettingsSubpageHeader>
  );
}
