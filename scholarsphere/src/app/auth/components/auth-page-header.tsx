import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AuthPageHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="text-center text-2xl font-semibold tracking-tight">
        {children}
      </h1>
    </>
  );
}

export function AuthPageError({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Alert>
        <AlertTitle>
          Error
        </AlertTitle>
        <AlertDescription>
          {children}
        </AlertDescription>
      </Alert>
    </>
  );
}
