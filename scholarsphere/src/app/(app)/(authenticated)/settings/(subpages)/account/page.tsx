import { type Metadata } from "next/types";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { AccountForm } from "@/app/(app)/(authenticated)/settings/(subpages)/account/account-settings-form";
import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

export const metadata: Metadata = {
  title: "Account Settings",
};

async function getInitialAccountFormValues() {
  // wait 2000ms
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const { userId } = await requireUser();

  const user = await prismaClient.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
      email: true,
    },
  });

  return user;
}

export default async function SettingsAccountPage() {
  const initialValues = await getInitialAccountFormValues();

  return (
    <>
      <SettingsSubpage
        title="Account"
        subtitle="Change your account settings here."
      >
        <AccountForm
          defaultValues={{
            ...initialValues,
            language: "en",
          }}
        />
      </SettingsSubpage>
    </>
  );
}
