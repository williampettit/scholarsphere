import { S_getSession } from "@/server/auth";

import { LoginButton } from "@/components/login-button";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { UserNav } from "@/components/user-nav";

export async function SiteHeader() {
  const session = await S_getSession();

  return (
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
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {session && session.user ? (
              <UserNav
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
  );
}
