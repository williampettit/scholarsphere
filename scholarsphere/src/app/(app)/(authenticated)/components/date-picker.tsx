"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <>
      <DatePickerPopover value={value} onChange={onChange}>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", {
            "text-muted-foreground": !value,
          })}
        >
          <Icons.Calendar className="mr-2 h-4 w-4" />

          {value ? format(value, "PPP") : "Pick a date"}
        </Button>
      </DatePickerPopover>
    </>
  );
}

type DatePickerPopoverProps = DatePickerProps & {
  children: React.ReactNode;
};

export function DatePickerPopover({
  children,
  value,
  onChange,
}: DatePickerPopoverProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent
          align="start"
          className="flex w-auto flex-col space-y-2 p-2"
        >
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={value}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
