import { type Metadata } from "next";

import { LoginButton } from "@/components/login-button";

import { AuthHeaderText } from "@/app/(with-globe)/auth/components/auth-header-text";

export const metadata: Metadata = {
  title: "Logout",
};

export default async function LogoutPage() {
  return (
    <>
      <AuthHeaderText>You have been logged out.</AuthHeaderText>

      <LoginButton />
    </>
  );
}
