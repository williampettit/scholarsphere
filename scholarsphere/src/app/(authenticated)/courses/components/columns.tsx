"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { CourseHoverCard } from "@/components/course-hover-card";

import { statuses } from "@/app/(authenticated)/courses/data/data";
import { CourseTableEntryType } from "@/app/(authenticated)/courses/data/schema";
import { DataTableColumnHeader } from "@/app/(authenticated)/courses/components/data-table-column-header";
import { DataTableRowActions } from "@/app/(authenticated)/courses/components/data-table-row-actions";

export const columns: ColumnDef<CourseTableEntryType>[] = [
  {
    id: "select",
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "short_id",
    enableHiding: false,
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course ID" />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.original.short_id}</Badge>,
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
        }}
      >
        <span className="max-w-[500px] truncate font-medium">
          {row.original.title}
        </span>
      </CourseHoverCard>
    ),
  },
  {
    accessorKey: "credit_hours",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit Hours" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[80px] truncate font-medium">
          {row.getValue("credit_hours")}
        </span>
      );
    },
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[80px] truncate font-medium">
          {Number(row.getValue("grade")).toFixed(2)}
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
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className={status.color}>{status.label}</span>
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
