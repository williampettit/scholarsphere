import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import { SettingsAccountForm } from "@/app/(authenticated)/settings/(subpages)/account/account-form";
import { SettingsSubpage } from "@/app/(authenticated)/settings/components/settings-subpage";

async function getInitialSettingsAccountFormValues() {
  const { userId } = await requireUser();

  const { email } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  return {
    email,
  };
}

export default async function SettingsAccountPage() {
  const { email } = await getInitialSettingsAccountFormValues();

  const language = "en";

  return (
    <SettingsSubpage
      title="Account"
      subtitle="Update your account settings."
    >
      <SettingsAccountForm
        initialValues={{
          email,
          language,
        }}
      />
    </SettingsSubpage>
  );
}
