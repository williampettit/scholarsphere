import dayjs from "dayjs";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRoleBadge } from "@/components/user-role-badge";

async function getUserData() {
  const { userId } = await requireUser();

  const user = await prismaClient.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
          semesters: true,
          assignments: {
            where: {
              isComplete: false,
            },
          },
        },
      },
    },
  });

  return user;
}

export default async function UserPage() {
  const userData = await getUserData();

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{`${userData.name}'s Profile`}</CardTitle>
        <CardDescription>
          Member since {dayjs(userData.createdAt).format("MMMM D, YYYY")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="text-lg font-bold">{userData.name}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Site Role</p>
          <UserRoleBadge
            role={userData.role}
            className="w-min text-lg font-bold"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Courses</p>
          <p className="text-lg font-bold">{userData._count.courses}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Semesters</p>
          <p className="text-lg font-bold">{userData._count.semesters}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Incomplete Assignments
          </p>
          <p className="text-lg font-bold">{userData._count.assignments}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Image</p>
          <div className="flex flex-row items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={userData.image ?? undefined}
                alt={`${userData.name ?? "User"}'s avatar`}
              />
              <AvatarFallback />
            </Avatar>

            <p className="text-lg font-bold">{userData.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
