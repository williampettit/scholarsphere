import { AuthPageError } from "@/app/auth/components/auth-page-header";
import { LoginButton } from "@/components/login-button";

export default async function LoginPage(props: {
  params: {};
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}) {
  const { searchParams } = props;

  const { error } = searchParams;

  return (
    <>
      <AuthPageError>{error ?? "Unknown"}</AuthPageError>

      <LoginButton />
    </>
  );
}
