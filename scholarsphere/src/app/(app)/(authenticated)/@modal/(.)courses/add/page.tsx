import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { AddCourseModal } from "@/components/modals/add-course-modal";

async function getActiveSemesters() {
  const { userId } = await requireUser();

  const semesters = await prismaClient.semester.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      endDate: true,
      startDate: true,
    },
  });

  return semesters;
}

export default async function AddCourseModalPage() {
  const semesters = await getActiveSemesters();

  return (
    <>
      <AddCourseModal semesters={semesters} />
    </>
  );
}
