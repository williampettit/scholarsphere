"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { siteConfig } from "@/lib/site-config";
import { userSchema } from "@/types/shared";

import { S_editUser } from "@/server/actions/edit-user";

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

const aiSettingsFormSchema = userSchema.pick({
  openaiApiKey: true,
});

type AiSettingsFormValues = z.infer<typeof aiSettingsFormSchema>;

type AiSettingsFormProps = {
  initialValues: Partial<AiSettingsFormValues>;
  placeholderApiKey: string;
};

export function AiSettingsForm({
  initialValues,
  placeholderApiKey,
}: AiSettingsFormProps) {
  const form = useForm<AiSettingsFormValues>({
    resolver: zodResolver(aiSettingsFormSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  function onSubmit(data: AiSettingsFormValues) {
    S_editUser({
      ...data,
    })
      .then(() => {
        toast({
          title: "AI settings updated",
          description: "Your AI settings have been updated.",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err,
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="openaiApiKey"
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
