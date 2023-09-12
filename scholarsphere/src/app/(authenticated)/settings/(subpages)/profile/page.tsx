import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import { ProfileForm } from "@/app/(authenticated)/settings/(subpages)/profile/profile-form";

async function getInitialProfileFormValues() {
  // wait 2000ms
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  const { userId } = await requireUser();

  const { name, image } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
    },
  });

  return {
    name: name,
    image: image,
  };
}

export default async function SettingsProfilePage() {
  const initialValues = await getInitialProfileFormValues();

  return (
    <>
      <ProfileForm defaultValues={initialValues} />
    </>
  );
}
