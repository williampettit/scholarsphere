import { S_getActiveCourses } from "@/server/actions/get-courses";
import { getSession } from "@/server/auth";

import { CommandMenu } from "@/components/command-menu";
import { LoginButton } from "@/components/login-button";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

export async function SiteHeader() {
  const session = await getSession();

  const activeCourses = await S_getActiveCourses();

  return (
    <>
      <header
        className="
        supports-backdrop-blur:bg-background/60
        sticky
        top-0
        z-50
        w-full
        border-b
        bg-background/80
        bg-none
        shadow-sm
        backdrop-blur
      "
      >
        <div
          className="
            container 
            flex 
            h-16 
            items-center 
            gap-8 
          "
        >
          <MainNav />

          <MobileNav />

          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu activeCourses={activeCourses} />
            </div>

            <ThemeToggle variant="ghost" />

            <nav className="flex items-center space-x-2">
              {session?.user ? (
                <UserNav
                  id={session.user.id}
                  name={session.user.name}
                  email={session.user.email}
                  image={session.user.image}
                />
              ) : (
                <LoginButton />
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
