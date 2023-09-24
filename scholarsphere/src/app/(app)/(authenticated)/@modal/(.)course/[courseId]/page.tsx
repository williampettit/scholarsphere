import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { EditCourseModal } from "@/components/modals/edit-course-modal";

type EditCourseModalPageProps = {
  params: {
    courseId: string;
  };
};

async function getCourseData(courseId: string) {
  const { userId } = await requireUser();

  const course = await prismaClient.course.findUniqueOrThrow({
    where: {
      id: courseId,
      userId,
    },
    select: {
      name: true,
      shortId: true,
      creditHours: true,
      currentGrade: true,

      assignments: {
        select: {
          id: true,
          title: true,
          dueDate: true,
          isComplete: true,
        },
      },
    },
  });

  return course;
}

export default async function EditCourseModalPage({
  params,
}: EditCourseModalPageProps) {
  const { courseId } = params;

  const courseData = await getCourseData(courseId);

  return (
    <>
      <EditCourseModal
        defaultValues={{
          id: courseId,
          ...courseData,
        }}
      />
    </>
  );
}
