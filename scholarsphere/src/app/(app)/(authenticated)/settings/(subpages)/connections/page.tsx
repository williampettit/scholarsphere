import { type Metadata } from "next/types";

import {
  AUTH_PROVIDER_DATA,
  FALLBACK_AUTH_PROVIDER_DATA,
} from "@/lib/auth-provider-data";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

export const metadata: Metadata = {
  title: "Connections",
};

async function getUserLinkedAccounts() {
  const { userId } = await requireUser();

  const accounts = await prismaClient.account.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      type: true,
      provider: true,
      providerAccountId: true,
      expires_at: true,
      refresh_token_expires_in: true,
      createdAt: true,
      updatedAt: true,
      scope: true,
    },
  });

  return accounts;
}

type ConnectionCardProps = {
  id: string;
  provider: string;
} & Record<string, string | number | Date | null>;

function ConnectionCard({
  id: connectionId,
  provider,
  ...data
}: ConnectionCardProps) {
  const { name: providerName, icon: AuthProviderIcon } =
    AUTH_PROVIDER_DATA.get(provider) ?? FALLBACK_AUTH_PROVIDER_DATA;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
              <AuthProviderIcon />

              <span>{providerName}</span>
            </div>

            <span className="font-sm font-medium text-muted-foreground">
              {connectionId}
            </span>
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col space-y-2 p-6 text-sm text-muted-foreground">
          {Object.entries(data)
            .map(([label, data]) => ({
              label,
              data: data ? data.toString() : "null",
            }))
            .map(({ label, data }) => (
              <div key={label} className="flex flex-row space-x-4">
                <span className="font-semibold uppercase text-muted-foreground">
                  {label}
                </span>
                <span className="text-accent-foreground">{data}</span>
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default async function LinkedAccountsPage() {
  const accounts = await getUserLinkedAccounts();

  return (
    <>
      <SettingsSubpage
        title="Connections"
        subtitle="View and manage your active connections."
      >
        <div className="flex flex-col space-y-4">
          {accounts.map((account) => (
            <ConnectionCard key={account.id} {...account} />
          ))}
        </div>
      </SettingsSubpage>
    </>
  );
}
