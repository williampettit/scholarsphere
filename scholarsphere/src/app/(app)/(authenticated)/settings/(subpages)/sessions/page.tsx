import { PersonIcon } from "@radix-ui/react-icons";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { DeleteSessionButton } from "@/app/(app)/(authenticated)/settings/(subpages)/sessions/delete-session-button";
import { SettingsSubpage } from "@/app/(app)/(authenticated)/settings/components/settings-subpage";

type SessionCardProps = {
  id: string;
} & Record<string, string | Date>;

async function getUserSessions() {
  const { userId } = await requireUser();

  const sessions = await prismaClient.session.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      expires: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return sessions;
}

function SessionCard({ id: sessionId, ...data }: SessionCardProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Icons.User className="h-6 w-6" />

              <span>{sessionId}</span>
            </div>

            <DeleteSessionButton sessionId={sessionId} />
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col space-y-2 p-6 text-sm text-muted-foreground">
          {Object.entries(data)
            .map(([label, value]) => ({
              label,
              value: value ? value.toString() : "null",
            }))
            .map(({ label, value }) => (
              <div key={label} className="flex flex-row space-x-4">
                <span className="font-semibold uppercase text-muted-foreground">
                  {label}
                </span>
                <span className="text-accent-foreground">{value}</span>
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default async function SessionsPage() {
  const sessions = await getUserSessions();

  return (
    <>
      <SettingsSubpage
        title="Sessions"
        subtitle="View and manage your active sessions."
      >
        <div className="flex flex-col space-y-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      </SettingsSubpage>
    </>
  );
}
