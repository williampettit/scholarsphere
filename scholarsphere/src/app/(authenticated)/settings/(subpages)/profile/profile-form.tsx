"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { S_editUser } from "@/server/actions/edit-user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 character.",
    })
    .max(64, {
      message: "Name must not be longer than 64 characters.",
    })
    .nullable(),
  image: z.string().url().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: Partial<ProfileFormValues>;
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    S_editUser(data)
      .then(() => {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  spellCheck={false}
                  placeholder="John Doe"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>

              <div className="flex flex-row items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={defaultValues.image ?? undefined}
                    alt={`${defaultValues.name ?? "User"}'s avatar`}
                  />
                  <AvatarFallback>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>

                <FormControl>
                  <Input
                    disabled
                    spellCheck={false}
                    placeholder="John Doe"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
              </div>

              <FormDescription>
                This is your avatar image. It is sourced from your connected
                account. It cannot be changed through this interface.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
