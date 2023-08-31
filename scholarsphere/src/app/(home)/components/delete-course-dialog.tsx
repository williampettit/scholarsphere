"use client";

import { Course } from "@/types/database-types";

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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface DeleteCourseDialogProps {
  course: Pick<Course, "id" | "name">;
}

export function DeleteCourseDialog({ course }: DeleteCourseDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            course from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const result = await S_deleteCourse({ id: course.id });
              if (result.success) {
                toast({
                  title: "Success",
                  description: "Course Deleted",
                });
              } else {
                toast({
                  title: "Error",
                  description:
                    result?.error?.toString() ?? "Unknown error occurred",
                });
              }
            }}
          >
            Delete Course
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
