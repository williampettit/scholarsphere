import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorIndicatorProps {
  children?: React.ReactNode;
}

export function ErrorIndicator({ children }: ErrorIndicatorProps) {
  return (
    <>
      <div className="text-md flex items-center justify-center text-red-500">
        <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
        {children ?? "An unknown error has occured."}
      </div>
    </>
  );
}
