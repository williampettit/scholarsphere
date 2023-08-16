import { AccountForm } from "@/app/(home)/settings/account/account-form";
import { mockGetUserData } from "@/data/mock-data";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";

export default async function SettingsAccountPage() {
  const userData = await mockGetUserData();

  return (
    <SettingsSubpageHeader
      title="Account"
      subtitle="Update your account settings."
    >
      <AccountForm userData={userData} />
    </SettingsSubpageHeader>
  );
}
