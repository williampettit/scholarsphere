import Link from "next/link";

import { signOut } from "next-auth/react";

import { navLinks, siteMap } from "@/config/site-config";

import { S_getActiveCourses } from "@/server/actions/get-courses";
import { getSession } from "@/server/auth";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserNav } from "@/components/user-nav";

import { CommandMenu } from "./command-menu";

export async function SideNav() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const activeCourses = await S_getActiveCourses();

  return (
    <div
      className="
        flex h-screen w-72
        flex-col justify-between
        border-r
        border-muted bg-accent/50
        p-2
      "
    >
      <div
        className="
          flex flex-col
          space-y-2
        "
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="
                flex flex-row
                items-center
                space-x-2
                rounded-sm
                bg-accent-foreground/10
                p-2
              "
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user.image}
                  alt={`${session.user.name}'s avatar image`}
                />

                <AvatarFallback>
                  {session.user.name.length > 0 ? (
                    session.user.name[0]
                  ) : (
                    <Icons.User />
                  )}
                </AvatarFallback>
              </Avatar>

              <p
                className="
                  line-clamp-1
                  text-sm
                "
              >
                {`${session.user.name}'s Scholarsphere`}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <Link className="text-sm font-medium leading-none" href="/user">
                  {session.user.name ? session.user.name : "User"}
                </Link>

                {session.user.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href={siteMap.settings.url}>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              // onClick={() =>
              //   signOut({
              //     redirect: true,
              //     callbackUrl: siteMap.logout.url,
              //   })
              // }
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu activeCourses={activeCourses} />
        </div>

        <div
          className="
            flex
            flex-col
            space-y-4
          "
        >
          {Object.entries(navLinks).map(([key, link]) => (
            <Link key={key} href={link.url}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <UserNav
          id={session.user.id}
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
        />
      </div>
    </div>
  );
}
