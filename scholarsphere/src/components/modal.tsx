"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type ModalProps = {
  children: React.ReactNode;
};

export function Modal({ children }: ModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const router = useRouter();

  function handleOnOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      router.back();
    }
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={handleOnOpenChange}>
      {children}
    </Dialog>
  );
}

type CloseModalButtonProps = ButtonProps & {
  // ...
};

export function CloseModalButton({ ...props }: CloseModalButtonProps) {
  const router = useRouter();

  function handleOnClick() {
    router.back();
  }

  return <Button type="button" onClick={handleOnClick} {...props} />;
}
