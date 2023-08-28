"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  S_deleteCourse,
  type DeleteCourseFormSchema,
  deleteCourseFormSchema,
} from "@/server/actions/delete-course";

interface DeleteCourseModalProps {
  children: React.ReactNode;
}

export function DeleteCourseModal({ children }: DeleteCourseModalProps) {
  const form = useForm<DeleteCourseFormSchema>({
    resolver: zodResolver(deleteCourseFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const [open, setOpen] = useState(false);

  async function onOpenChange(value: boolean) {
    form.reset();
    setOpen(value);
  }

  async function onSubmit(data: DeleteCourseFormSchema) {
    const result = await S_deleteCourse(data);
    if (result.success) {
      toast({
        title: "Success",
        description: "Course Deleted",
      });
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result?.error?.toString() ?? "Unknown error occurred",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogFooter>
              <Button
                type="reset"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="destructive"
                loading={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  form.formState.isValidating
                }
              >
                Delete Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
