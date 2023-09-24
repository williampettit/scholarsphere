import { S_getActiveCourses } from "@/server/actions/get-courses";

import { AddAssignmentModal } from "@/components/modals/add-assignment-modal";

export default async function AddAssignmentModalPage() {
  const activeCourses = await S_getActiveCourses();

  return (
    <>
      <AddAssignmentModal activeCourses={activeCourses} />
    </>
  );
}
