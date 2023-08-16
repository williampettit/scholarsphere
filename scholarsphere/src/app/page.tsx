import { redirect } from "next/navigation";

async function mockGetSession() {
  return true;
}

export default async function Page() {
  const session = await mockGetSession();
  
  if (session) {
    redirect("/home");
  }
  
  return <>
    Hero Page
  </>;
}
