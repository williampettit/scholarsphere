"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { S_editAssignment } from "@/server/actions/edit-assignment";

import { DatePickerPopover } from "@/app/(authenticated)/components/date-picker";

interface AssignmentDueDatePopoverProps {
  assignmentId: string;
  children: React.ReactNode;
}

export function AssignmentDueDatePopover({
  assignmentId,
  children,
}: AssignmentDueDatePopoverProps) {
  const [date, setDate] = useState<Date>();

  const router = useRouter();

  useEffect(() => {
    if (!date) {
      return;
    }

    S_editAssignment({
      id: assignmentId,
      dueDate: date,
    })
      .then(
        () => {
          router.refresh();
        }
      )
      .catch((err) => {
        alert(err);
      });
  }, [date]);

  return (
    <>
      <DatePickerPopover value={date} onChange={setDate}>
        {children}
      </DatePickerPopover>
    </>
  );
}
