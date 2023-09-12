interface AuthHeaderTextProps {
  children: React.ReactNode;
}

export function AuthHeaderText({ children }: AuthHeaderTextProps) {
  return (
    <>
      <h1 className="text-center text-2xl font-semibold tracking-tight">
        {children}
      </h1>
    </>
  );
}
