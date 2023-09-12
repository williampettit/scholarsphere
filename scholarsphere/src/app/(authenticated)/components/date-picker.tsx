"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerBaseProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

interface DatePickerPopoverProps extends DatePickerBaseProps {
  children: React.ReactNode;
}

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
          <Select
            onValueChange={(value) =>
              onChange(addDays(new Date(), parseInt(value)))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              selected={value}
              onSelect={onChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export function DatePickerWithPresets({
  value,
  onChange,
}: DatePickerBaseProps) {
  return (
    <>
      <DatePickerPopover value={value} onChange={onChange}>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </DatePickerPopover>
    </>
  );
}
