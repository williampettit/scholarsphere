import { type Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site-config";

import { type LayoutProps } from "@/types/layout";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Chat",
};

export default async function AIChatLayout({ children }: LayoutProps) {
  const { userId } = await requireUser();

  const { openAiApiKey: userOpenAiApiKey } =
    await prismaClient.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        openAiApiKey: true,
      },
    });

  if (!userOpenAiApiKey) {
    return (
      <>
        <p>
          To use the AI Chat feature, you must first set up your OpenAI API key.
          <Link
            href="/settings/ai"
            className="
              text-blue-500
              transition-colors
              hover:text-blue-600
            "
          >
            You can do that here.
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>{siteConfig.name} AI Chat</PageHeaderTitle>

        <PageHeaderSubtitle>
          Here you can use the {siteConfig.name} AI Chat to interact with your
          college data.
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
