"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { S_addAssignmentFromNaturalLanguage } from "@/server/actions/add-assignment";
import { addAssignmentFromNaturalLanguageSchema } from "@/server/actions/schemas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function AddAssignmentInputForm({ courseId }: { courseId: string }) {
  const form = useForm<z.infer<typeof addAssignmentFromNaturalLanguageSchema>>({
    resolver: zodResolver(addAssignmentFromNaturalLanguageSchema),
    defaultValues: {
      courseId: courseId,
    },
  });

  const { pending } = useFormStatus();

  return (
    <Form {...form}>
      <form
        className="flex flex-row space-x-4"
        action={async () => {
          const formData = new FormData();
          Object.entries(form.getValues()).forEach(([key, value]) => {
            formData.set(key, value);
          });
          await S_addAssignmentFromNaturalLanguage(formData);
        }}
      >
        <FormField
          control={form.control}
          name="naturalLanguageQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  disabled={pending}
                  placeholder="Test 2 this Tuesday at 8 AM"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={pending}>
          Add
        </Button>
      </form>
    </Form>
  );
}
