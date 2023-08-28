import { LoginButton } from "@/components/login-button";
import { AuthPageHeader } from "@/app/auth/components/auth-page-header";

export default async function LogoutPage() {
  return (
    <>
      <AuthPageHeader>You have been logged out.</AuthPageHeader>
      <LoginButton />
    </>
  );
}
