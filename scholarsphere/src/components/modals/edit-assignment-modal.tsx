"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";

import { S_editAssignment } from "@/server/actions/edit-assignment";
import {
  type EditAssignmentFormValues,
  editAssignmentFormSchema,
} from "@/server/actions/schemas";

import { DeleteAssignmentDialog } from "@/components/dialogs/delete-assignment-dialog";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

import { DatePicker } from "@/app/(app)/(authenticated)/components/date-picker";

type EditAssignmentModalProps = {
  defaultValues: EditAssignmentFormValues;
};

export function EditAssignmentModal({
  defaultValues,
}: EditAssignmentModalProps) {
  const { id: assignmentId } = defaultValues;

  const form = useForm<EditAssignmentFormValues>({
    resolver: zodResolver(editAssignmentFormSchema),
    defaultValues,
  });

  async function onSubmit(data: EditAssignmentFormValues) {
    S_editAssignment(data)
      .then(() => {
        toast({
          title: "Assignment updated",
        });
      })
      .catch(() => {
        toast({
          title: "Error updating assignment",
          variant: "destructive",
        });
      });
  }

  return (
    <>
      <Modal>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Edit Assignment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          placeholder="Test 1"
                          {...field}
                        />
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
                      <FormLabel>Due Date</FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isComplete"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Complete</FormLabel>
                        <FormDescription>
                          Mark this assignment as complete.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex flex-row items-start justify-between">
                <div className="flex flex-row space-x-2">
                  <DeleteAssignmentDialog assignmentId={assignmentId}>
                    <Button type="button" variant="destructive" size="icon">
                      <Icons.Trash className="h-4 w-4" />
                    </Button>
                  </DeleteAssignmentDialog>
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
