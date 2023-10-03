"use client";

import { S_deleteCourse } from "@/server/actions/delete-course";

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

type DeleteCourseDialogProps = {
  courseId: string;
  children: React.ReactNode;
};

export function DeleteCourseDialog({
  courseId,
  children,
}: DeleteCourseDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            onClick={() => {
              S_deleteCourse({ id: courseId })
                .then(() => {
                  toast({
                    title: "Course deleted",
                  });
                })
                .catch(() => {
                  toast({
                    title: "Failed to delete course",
                    variant: "destructive",
                  });
                });
            }}
          >
            Delete Course
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
