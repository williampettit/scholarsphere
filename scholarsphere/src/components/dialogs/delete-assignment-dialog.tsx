"use client";

import { S_deleteAssignment } from "@/server/actions/delete-assignment";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type DeleteAssignmentDialogProps = {
  assignmentId: string;
  children: React.ReactNode;
};

export function DeleteAssignmentDialog({
  assignmentId,
  children,
}: DeleteAssignmentDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            onClick={() => {
              S_deleteAssignment({
                id: assignmentId,
              })
                .then(() => {
                  toast({
                    title: "Assignment deleted",
                  });
                })
                .catch(() => {
                  toast({
                    title: "Failed to delete assignment",
                    variant: "destructive",
                  });
                });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
