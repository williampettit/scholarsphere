interface AuthPageHeaderProps {
  children: React.ReactNode;
}

export function AuthPageHeader({ children }: AuthPageHeaderProps) {
  return (
    <h1 className="text-center text-2xl font-semibold tracking-tight">
      {children}
    </h1>
  );
}
