import { S_getUser } from "@/server/auth";
import { SettingsAccountForm } from "@/app/(home)/settings/account/account-form";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";

export default async function SettingsAccountPage() {
  const user = await S_getUser();
  return (
    <SettingsSubpageHeader
      title="Account"
      subtitle="Update your account settings."
    >
      <SettingsAccountForm initialValues={{
        language: user.language,
        email: user.email,
      }} />
    </SettingsSubpageHeader>
  );
}
