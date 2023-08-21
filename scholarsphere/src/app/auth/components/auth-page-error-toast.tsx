"use client";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface AuthPageErrorToastProps {
  errorDesc: string;
}

export function AuthPageErrorToast({
  errorDesc,
}: AuthPageErrorToastProps) {
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "Error",
        description: errorDesc,
      });
    }, 0);
  }, [errorDesc]);

  return null;

  // return (
  //   <>
  //     <div className="fixed inset-0 flex items-end justify-center p-4 pointer-events-none sm:items-start sm:justify-end">
  //       <div className="max-w-xs w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
  //         <Alert>
  //           <AlertTitle>Error</AlertTitle>
  //           <AlertDescription>{children}</AlertDescription>
  //         </Alert>
  //       </div>
  //     </div>
  //   </>
  // );
}
