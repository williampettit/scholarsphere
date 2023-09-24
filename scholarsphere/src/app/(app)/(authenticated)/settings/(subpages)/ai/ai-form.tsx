"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { S_editUser } from "@/server/actions/edit-user";
import {
  type EditAiChatSettingsFormValues,
  editAiChatSettingsFormSchema,
} from "@/server/actions/schemas";

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

type AiChatSettingsFormProps = {
  defaultValues: Partial<EditAiChatSettingsFormValues>;
  placeholderApiKey: string;
};

export function AiChatSettingsForm({
  defaultValues,
  placeholderApiKey,
}: AiChatSettingsFormProps) {
  const form = useForm<EditAiChatSettingsFormValues>({
    resolver: zodResolver(editAiChatSettingsFormSchema),
    defaultValues,
  });

  async function onSubmit(data: EditAiChatSettingsFormValues) {
    S_editUser(data)
      .then(() => {
        toast({
          title: "AI Chat settings updated",
          description: "Your AI Chat settings have been updated.",
        });
      })
      .catch(() => {
        toast({
          title: "Error updating AI Chat settings",
          variant: "destructive",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="openAiApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={placeholderApiKey}
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                This is optional, however, providing an API key will allow you
                to use the AI features of {siteConfig.name}. You can generate an
                OpenAI API key{" "}
                <Link
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  className="font-medium text-accent-foreground underline underline-offset-2"
                >
                  here
                </Link>
                .
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
