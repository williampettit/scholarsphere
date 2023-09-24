import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { EditAssignmentModal } from "@/components/modals/edit-assignment-modal";

type EditAssignmentModalPageProps = {
  params: {
    assignmentId: string;
  };
};

async function getAssignmentData(assignmentId: string) {
  const { userId } = await requireUser();

  const assignment = await prismaClient.assignment.findUniqueOrThrow({
    where: {
      id: assignmentId,
      userId,
    },
    select: {
      title: true,
      dueDate: true,
      isComplete: true,
    },
  });

  return assignment;
}

export default async function EditAssignmentModalPage({
  params,
}: EditAssignmentModalPageProps) {
  const { assignmentId } = params;

  const assignmentData = await getAssignmentData(assignmentId);

  return (
    <>
      <EditAssignmentModal
        defaultValues={{
          id: assignmentId,
          title: assignmentData.title,
          dueDate: assignmentData.dueDate,
          isComplete: assignmentData.isComplete,
        }}
      />
    </>
  );
}
