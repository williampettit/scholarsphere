import { Icons } from "@/components/icons";

interface LoadingProps {
  children?: React.ReactNode;
}

export function Loading({ children }: LoadingProps) {
  return (
    <div className="text-md flex items-center justify-center text-muted-foreground">
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      {children ?? "Loading..."}
    </div>
  );
}
