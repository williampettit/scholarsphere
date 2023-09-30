"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { S_addAssignmentFromNaturalLanguage } from "@/server/actions/add-assignment-from-natural-language";
import {
  type AddAssignmentFromNaturalLanguageValues,
  addAssignmentFromNaturalLanguageSchema,
} from "@/server/actions/schemas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type AddAssignmentInputFormProps = {
  courseId: string;
};

export function AddAssignmentInputForm({
  courseId,
}: AddAssignmentInputFormProps) {
  const form = useForm<z.infer<typeof addAssignmentFromNaturalLanguageSchema>>({
    resolver: zodResolver(addAssignmentFromNaturalLanguageSchema),
    defaultValues: {
      courseId,
      naturalLanguageQuery: "",
    },
  });

  function onSubmit(data: AddAssignmentFromNaturalLanguageValues) {
    console.log(
      "AddAssignmentInputForm.onSubmit: data =",
      JSON.stringify(data, null, 2),
    );

    S_addAssignmentFromNaturalLanguage(data)
      .then(() => {
        toast({
          variant: "success",
          title: "Success",
          description: "Assignment(s) added",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to add assignment(s)",
          description: error.message,
        });
      });
  }

  const formLoading =
    form.formState.isSubmitting ||
    form.formState.isLoading ||
    form.formState.isValidating;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row space-x-4"
        >
          <FormField
            control={form.control}
            name="naturalLanguageQuery"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    rows={5}
                    disabled={formLoading}
                    placeholder={[
                      "Add assignments by typing them in natural language. For example:",
                      "Quiz 2 this Sunday by 8 PM",
                      "Test 2 next Tuesday at 8:30 AM",
                    ].join("\n")}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" loading={formLoading}>
            Add
          </Button>
        </form>
      </Form>
    </>
  );
}
