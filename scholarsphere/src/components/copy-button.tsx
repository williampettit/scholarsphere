"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type CopyButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export async function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        "relative z-10 h-6 w-6 text-accent-foreground hover:bg-accent-foreground hover:text-accent",
        className,
      )}
      onClick={() => {
        copyToClipboard(value);
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>

      {hasCopied ? (
        <Icons.Check className="h-3 w-3" />
      ) : (
        <Icons.Copy className="h-3 w-3" />
      )}
    </Button>
  );
}
