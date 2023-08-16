"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

const PROVIDERS = [
  {
    name: "GitHub",
    icon: Icons.gitHub,
    disabled: false,
  },
  {
    name: "Google",
    icon: Icons.google,
    disabled: true,
  },
  {
    name: "Apple",
    icon: Icons.apple,
    disabled: true,
  },
];

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <>
      <div className={cn("grid gap-4", className)} {...props}>
        {PROVIDERS.map((provider) => (
          <Button
            variant="outline"
            type="button"
            key={provider.name}
            disabled={provider.disabled}
          >
            <provider.icon className="mr-2 h-4 w-4" />
            {provider.name}
          </Button>
        ))}
      </div>
    </>
  );
}
