"use client";

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { COURSE_STATUS_MAP } from "@/lib/course-status-map";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "@/app/(app)/(authenticated)/course-table/components/data-table-faceted-filter";
import { DataTableViewOptions } from "@/app/(app)/(authenticated)/course-table/components/data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter courses..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={Object.entries(COURSE_STATUS_MAP).map(([key, data]) => ({
              value: key,
              label: data.label,
              icon: data.icon,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
