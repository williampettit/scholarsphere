"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { COURSE_STATUS_MAP } from "@/lib/course-status-map";
import { cn, getGradeColor } from "@/lib/utils";
import {
  type CourseStatusEnum,
  type CourseTableEntryType,
} from "@/types/shared";

import { CourseHoverCard } from "@/components/course-hover-card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/app/(app)/(authenticated)/course-table/components/data-table-column-header";
import { DataTableRowActions } from "@/app/(app)/(authenticated)/course-table/components/data-table-row-actions";

export const columns: ColumnDef<CourseTableEntryType>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  },
  {
    accessorKey: "shortId",
    enableHiding: false,
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course ID" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.shortId}</Badge>,
  },
  {
    accessorKey: "title",
    enableHiding: false,
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <CourseHoverCard
        course={{
          ...row.original,
          status: row.original.status,
        }}
      >
        <span className="max-w-[500px] truncate font-medium">
          {row.original.name}
        </span>
      </CourseHoverCard>
    ),
  },
  {
    accessorKey: "creditHours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit Hours" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[80px] truncate font-medium">
          {row.getValue("creditHours")}
        </span>
      );
    },
  },
  {
    meta: "Grade",
    accessorKey: "currentGrade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            "max-w-[80px] truncate font-medium",
            getGradeColor(row.getValue("currentGrade")),
          )}
        >
          {Number(row.getValue("currentGrade")).toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<CourseStatusEnum>("status");

      const {
        icon: StatusIcon,
        classes: statusColor,
        label: statusLabel,
      } = COURSE_STATUS_MAP[status];

      return (
        <div className="flex w-[120px] items-center">
          <StatusIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className={statusColor}>{statusLabel}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
