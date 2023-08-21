import { getServerSessionWrapper } from "@/server/auth";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { UserNav } from "@/components/user-nav";
import { LoginButton } from "@/components/login-button";

export async function SiteHeader() {
  const session = await getServerSessionWrapper();
  
  return (
    <header
      className="
      sticky
      top-0
      w-full
      z-50
      supports-backdrop-blur:bg-background/60
      border-b
      backdrop-blur
      bg-background/80
      bg-none
    "
    >
      <div className="container flex items-center h-16">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center space-x-2">
            {session ? <UserNav {...session.user} /> : <LoginButton />}
          </nav>
        </div>
      </div>
    </header>
  );
}
