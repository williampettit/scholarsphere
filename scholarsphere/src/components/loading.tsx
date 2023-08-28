import { Icons } from "@/components/icons";

interface LoadingProps {
  children?: React.ReactNode;
}

export function Loading({ children = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center text-md text-muted-foreground">
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      {children}
    </div>
  );
}
