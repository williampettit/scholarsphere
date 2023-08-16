import { redirect } from "next/navigation";

async function getSession() {
  return true;
}

export default async function HeroPage() {
  const session = await getSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return <>TODO: Hero page</>;
}
