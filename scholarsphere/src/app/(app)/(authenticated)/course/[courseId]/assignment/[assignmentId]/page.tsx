import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

type AssignmentPageParams = {
  courseId: string;
  assignmentId: string;
};

type AssignmentPageProps = {
  params: AssignmentPageParams;
};

async function getAssignmentData(params: AssignmentPageParams) {
  const { assignmentId, courseId } = params;

  const { userId } = await requireUser();

  const assignment = await prismaClient.assignment.findUniqueOrThrow({
    where: {
      id: assignmentId,
      courseId,
      userId,
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
      isComplete: true,
    },
  });

  return assignment;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const assignmentData = await getAssignmentData(params);

  return (
    <pre className="text-emerald-600">
      {JSON.stringify(assignmentData, null, 2)}
    </pre>
  );
}
