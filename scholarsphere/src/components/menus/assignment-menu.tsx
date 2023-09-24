"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AssignmentMenuProps = {
  courseId: string;
  assignmentId: string;
  assignmentName: string;
};

export function AssignmentMenu({
  courseId,
  assignmentId,
  assignmentName,
}: AssignmentMenuProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Icons.HorizontalDots className="cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel className="flex flex-col space-y-1">
            <p className="line-clamp-1 overflow-ellipsis">Assignment</p>
            <p className="line-clamp-1 overflow-ellipsis font-medium text-muted-foreground">
              {assignmentName}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <Link
              href={`/course/${courseId}/assignment/${assignmentId}`}
              scroll={false}
            >
              <DropdownMenuItem>Edit...</DropdownMenuItem>
            </Link>

            <Link
              href={`/course/${courseId}/assignment/${assignmentId}`}
              scroll={false}
            >
              <DropdownMenuItem className="text-rose-600">
                Delete...
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
