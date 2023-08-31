import { S_requireUser } from "@/server/auth";

import { SettingsAccountForm } from "@/app/(home)/settings/account/account-form";
import { SettingsSubpageHeader } from "@/app/(home)/settings/components/settings-page-header";

export default async function SettingsAccountPage() {
  const { language, email } = await S_requireUser();

  return (
    <SettingsSubpageHeader
      title="Account"
      subtitle="Update your account settings."
    >
      <SettingsAccountForm
        initialValues={{
          language: language,
          email: email,
        }}
      />
    </SettingsSubpageHeader>
  );
}
