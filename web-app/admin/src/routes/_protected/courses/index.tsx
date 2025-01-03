import { getAllCourses } from "@/lib/queries/courses.query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Course } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { ArrowUpDown, PlusCircle, Search } from "lucide-react";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_protected/courses/")({
  component: RouteComponent,
});

const itemsPerPageArray = [10, 20, 30, 40, 50, 100];

function RouteComponent() {
  const coulmnHelper = createColumnHelper<Course>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const itemsPerPage = sessionStorage.getItem("itemsPerPage") || "10";

  const { data, isPending } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    staleTime: 1000 * 60 * 15,
  });

  const columnHeaderArray = useMemo(
    (): Array<keyof Course> => [
      "createdAt",
      "title",
      "category",
      "price",
    ],
    [],
  );

  const handleNavigate = (slug: string) => {
    navigate({
      to: `/courses/$slug`,
      params: { slug },
    });
  };

  const columns = useMemo(
    () =>
      columnHeaderArray.map((header) => {
        return coulmnHelper.accessor(header, {
          header: () => {
            if (header === "createdAt") return "Created At";
            if (header === "_id") return "ID";
            return header.at(0)!.toUpperCase() + header.slice(1);
          },
          cell: (info) => {
            if (header === "createdAt") {
              const data = info.getValue() as string;
              const date = format(data, "dd/MM/yyyy");
              return date.toString();
            }

            return info.getValue().toString();
          },
        });
      }),
    [coulmnHelper, columnHeaderArray],
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: parseInt(itemsPerPage),
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const totalPages = table.getPageCount();

  return (
    <>
      <section className="flex items-center justify-between py-4">
        <div className="flex w-1/3 items-center gap-4 rounded-md border-2 px-4 py-2 focus-within:border-primary">
          <Search size={18} />
          <input
            id="filter-courses"
            placeholder="Filter courses..."
            value={
              (table
                .getColumn("title")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("title")
                ?.setFilterValue(event.target.value)
            }
            className="bg-transparent placeholder:text-sm focus:outline-none group-active:border-primary"
          />
        </div>
        <Button
          onClick={() =>
            navigate({
              to: "/courses/add",
            })
          }
        >
          <PlusCircle size={20} />
          Add Course
        </Button>
      </section>
      {isPending ? (
        <TableSkeleton page={table.getState().pagination.pageSize} />
      ) : (
        <section className={"min-h-[407px]"}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className="flex items-center gap-3"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <ArrowUpDown size={14} />
                          </button>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => handleNavigate(row.original.slug)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      )}
      <div className="flex items-start justify-between gap-4">
        <Select
          onValueChange={(value) => {
            sessionStorage.setItem("itemsPerPage", value);
            table.setPageSize(parseInt(value));
          }}
          defaultValue={String(table.getState().pagination.pageSize)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Items per page</SelectLabel>
              {itemsPerPageArray.map((item) => (
                <SelectItem key={item} value={String(item)}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Pagination>
          <PaginationContent className="ml-auto">
            <PaginationItem
              onClick={() => table?.previousPage()}
              aria-disabled={!table?.getCanPreviousPage()}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              <PaginationPrevious />
            </PaginationItem>

            {totalPages > 7 ? (
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <>
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => table?.setPageIndex(i)}
                        aria-current={
                          i === table?.getState().pagination.pageIndex
                        }
                        className="aria-[current='true']:bg-secondary"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem
                  onClick={() => table?.setPageIndex(totalPages)}
                >
                  <PaginationLink>{totalPages}</PaginationLink>
                </PaginationItem>
              </>
            ) : (
              <>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => table?.setPageIndex(i)}
                      aria-current={
                        i === table?.getState().pagination.pageIndex
                      }
                      className="aria-[current='true']:bg-secondary"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </>
            )}

            <PaginationItem
              onClick={() => table?.nextPage()}
              aria-disabled={!table?.getCanNextPage()}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
