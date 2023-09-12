import { genPlaceholderApiKey } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import { AiSettingsForm } from "@/app/(authenticated)/settings/(subpages)/ai/ai-form";
import { SettingsSubpage } from "@/app/(authenticated)/settings/components/settings-subpage";

async function getInitialAiSettingsFormValues() {
  const { userId } = await requireUser();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      openaiApiKey: true,
    },
  });

  return {
    openaiApiKey: user.openaiApiKey,
  };
}

export default async function AiSettingsPage() {
  const initialValues = await getInitialAiSettingsFormValues();

  const placeholderApiKey = genPlaceholderApiKey();

  return (
    <SettingsSubpage title="AI" subtitle="Update your AI settings.">
      <AiSettingsForm
        placeholderApiKey={placeholderApiKey}
        initialValues={initialValues}
      />
    </SettingsSubpage>
  );
}
