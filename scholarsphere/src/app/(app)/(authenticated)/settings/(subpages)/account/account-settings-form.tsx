"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LANGUAGE_MAP } from "@/lib/languages";
import { cn, entries } from "@/lib/utils";

import { S_editUser } from "@/server/actions/edit-user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

const accountFormSchema = z.object({
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

  email: z.string().email().nullable().optional(),

  language: z.enum(Object.keys(LANGUAGE_MAP) as [keyof typeof LANGUAGE_MAP], {
    required_error: "Language is required.",
    invalid_type_error: "Language is invalid.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({
  defaultValues,
}: {
  defaultValues: Partial<AccountFormValues>;
}) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: AccountFormValues) {
    S_editUser(data)
      .then(() => {
        toast({
          title: "Account updated",
          description: "Your account has been updated.",
        });
      })
      .catch((error) => {
        toast({
          title: "Failed to update account",
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
                  <AvatarFallback />
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                This is the email address associated with your account. It
                cannot be changed for now.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled
                      variant="outline"
                      role="combobox"
                      className={cn("w-[200px] justify-between", {
                        "text-muted-foreground": !field.value,
                      })}
                    >
                      {field.value
                        ? LANGUAGE_MAP[field.value].label
                        : "Select language"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {entries(LANGUAGE_MAP).map(
                        ([languageId, { label: languageLabel }]) => (
                          <CommandItem
                            key={languageId}
                            value={languageId}
                            onSelect={() =>
                              form.setValue("language", languageId)
                            }
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                languageId === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {languageLabel}
                          </CommandItem>
                        ),
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard. It
                cannot be changed for now.
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
