"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

const addCourseFormSchema = z.object({
  name: z.string(),
  shortId: z.string(),
  creditHours: z.number({
    // invalid_type_error: "invalid type erro",
  }).transform((val) => Number(val)),
});

type AddCourseFormValues = z.infer<typeof addCourseFormSchema>;

export function AddCourseForm() {
  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(addCourseFormSchema),
  });

  function onSubmit(data: AddCourseFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Applied Linear Algebra" {...field} />
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
              <FormLabel>Short ID</FormLabel>
              <FormControl>
                <Input placeholder="MATH 3300" {...field} />
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
              <FormLabel>Credit Hours</FormLabel>
              <FormControl>
                <Input placeholder="3" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
