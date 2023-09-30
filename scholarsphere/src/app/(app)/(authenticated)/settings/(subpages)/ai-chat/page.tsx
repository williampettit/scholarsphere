import { type Metadata } from "next/types";

import { getPlaceholderApiKey } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { AiChatSettingsForm } from "@/app/(app)/(authenticated)/settings/(subpages)/ai-chat/ai-chat-settings-form";
import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

export const metadata: Metadata = {
  title: "AI Chat Settings",
};

async function getInitialAiSettingsFormValues() {
  const { userId } = await requireUser();

  const user = await prismaClient.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      openAiApiKey: true,
    },
  });

  return {
    openAiApiKey: user.openAiApiKey,
  };
}

export default async function AiSettingsPage() {
  const initialValues = await getInitialAiSettingsFormValues();

  const placeholderApiKey = getPlaceholderApiKey();

  return (
    <>
      <SettingsSubpage title="AI Chat" subtitle="Update your AI Chat settings.">
        <AiChatSettingsForm
          placeholderApiKey={placeholderApiKey}
          defaultValues={initialValues}
        />
      </SettingsSubpage>
    </>
  );
}