"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

import { S_editCourse } from "@/server/actions/edit-course";
import {
  type EditCourseFormValues,
  editCourseFormSchema,
} from "@/server/actions/schemas";

import { DeleteCourseDialog } from "@/components/dialogs/delete-course-dialog";
import { Icons } from "@/components/icons";
import { CloseModalButton, Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

type EditCourseModalProps = {
  defaultValues: EditCourseFormValues;
};

export function EditCourseModal({ defaultValues }: EditCourseModalProps) {
  const { id: courseId } = defaultValues;

  const form = useForm<EditCourseFormValues>({
    resolver: zodResolver(editCourseFormSchema),
    defaultValues,
  });

  async function onSubmit(data: EditCourseFormValues) {
    S_editCourse(data)
      .then(() => {
        toast({
          title: "Course updated",
        });
      })
      .catch(() => {
        toast({
          title: "Error updating course",
          variant: "destructive",
        });
      });
  }

  return (
    <>
      <Modal>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          placeholder="Calculus I"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Short ID</FormLabel>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          placeholder="MATH 2211"
                          {...field}
                          value={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creditHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Credit Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          {...field}
                          {...form.register("creditHours", {
                            setValueAs: (value) => Number(value),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentGrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Current Grade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="95"
                          {...field}
                          {...form.register("currentGrade", {
                            setValueAs: (value) => Number(value),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex flex-row items-start justify-between">
                <div className="flex flex-row space-x-2">
                  <DeleteCourseDialog courseId={courseId}>
                    <Button type="button" variant="destructive" size="icon">
                      <Icons.Trash className="h-4 w-4" />
                    </Button>
                  </DeleteCourseDialog>
                </div>

                <div className="flex flex-row space-x-2">
                  <CloseModalButton type="reset" variant="outline">
                    Cancel
                  </CloseModalButton>

                  <Button type="submit">Save</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Modal>
    </>
  );
}
