import { Icons } from "@/components/icons";

type LoadingIndicatorProps = {
  children?: React.ReactNode;
};

export function LoadingIndicator({ children }: LoadingIndicatorProps) {
  return (
    <>
      <div className="text-md flex items-center justify-center text-muted-foreground">
        <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        {children ?? "Loading..."}
      </div>
    </>
  );
}
