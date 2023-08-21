import { getServerSessionWrapper } from "@/server/auth";
import { SettingsAccountForm } from "@/app/(home)/(dashboard)/settings/account/account-form";
import { SettingsSubpageHeader } from "@/app/(home)/(dashboard)/settings/components/settings-page-header";

export default async function SettingsAccountPage() {
  const session = await getServerSessionWrapper();

  return (
    <SettingsSubpageHeader
      title="Account"
      subtitle="Update your account settings."
    >
      <SettingsAccountForm initialValues={{
        language: session?.user?.language ?? undefined,
        email: session?.user?.email ?? undefined,
      }} />
    </SettingsSubpageHeader>
  );
}
