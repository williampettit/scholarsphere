import { ProfileForm } from "@/app/(home)/(dashboard)/settings/profile-form";
import { SettingsSubpageHeader } from "@/app/(home)/(dashboard)/settings/components/settings-page-header";
import { getServerSessionWrapper } from "@/server/auth";

export default async function SettingsProfilePage() {
  const session = await getServerSessionWrapper();
  
  return (
    <SettingsSubpageHeader
      title="Profile"
      subtitle="This is how others will see you on the site."
    >
      <ProfileForm
        initialData={{
          name: session?.user?.name ?? undefined,
        }}
      />
    </SettingsSubpageHeader>
  );
}
