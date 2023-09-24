"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

import { type Course } from "@/types/shared";

import { S_addAssignment } from "@/server/actions/add-assignment";
import {
  type AddAssignmentFormValues,
  addAssignmentFormSchema,
} from "@/server/actions/schemas";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { DatePicker } from "@/app/(app)/(authenticated)/components/date-picker";

type AddAssignmentModalProps = {
  activeCourses: Pick<Course, "id" | "name">[];
};

export function AddAssignmentModal({ activeCourses }: AddAssignmentModalProps) {
  const form = useForm<AddAssignmentFormValues>({
    resolver: zodResolver(addAssignmentFormSchema),
    defaultValues: {
      title: "",
      dueDate: undefined,
      courseId: undefined,
    },
  });

  function onSubmit(data: AddAssignmentFormValues) {
    S_addAssignment(data)
      .then(() => {
        toast({
          title: "Assignment added",
        });
      })
      .catch(() => {
        toast({
          title: "Error adding assignment",
          variant: "destructive",
        });
      });
  }

  return (
    <>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      required
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeCourses
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((activeCourse) => (
                            <SelectItem
                              key={activeCourse.id}
                              value={activeCourse.id}
                            >
                              {activeCourse.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Test 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Assignment Due Date</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4 pt-4">
                <CloseModalButton type="reset" variant="outline">
                  Cancel
                </CloseModalButton>

                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Modal>
    </>
  );
}
