"use client";

import { useState } from "react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AssignmentListItemDropdownMenu() {
  const [open, setOpen] = useState(false);

  function todo() {
    alert("@TODO");
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={todo}>Rename...</DropdownMenuItem>
          <DropdownMenuItem onClick={todo}>Duplicate...</DropdownMenuItem>
          <DropdownMenuItem onClick={todo}>Set due date...</DropdownMenuItem>
          <DropdownMenuItem onClick={todo}>
            Mark as complete...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={todo} className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
