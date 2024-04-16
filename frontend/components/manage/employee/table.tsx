"use client";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export type Employee = {
  id: string;
  name: string;
  image: string;
};
const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <span>ID</span>;
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "image",
    header: () => {},
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Avatar>
          <AvatarImage src={row.getValue("image")} alt="avatar" />
          <AvatarFallback>{row.original.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        // <Button
        //   className="p-2"
        //   variant="ghost"
        //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        // >
        <span>Tên nhân viên</span>

        // <CaretSortIcon className="ml-2 h-4 w-4" />
        // </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize pl-2 leading-6">{row.getValue("name")}</div>
    ),
  },
];
const EmployeeTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const data: Employee[] = [
    {
      id: "1",
      name: "Nguyễn Thị Huệ",
      image:
        "https://img.freepik.com/free-photo/medium-shot-contemplative-man-seaside_23-2150531618.jpg?t=st=1713268100~exp=1713271700~hmac=b9709cabe1756ef58e8c6ac63bca42b780653131efb763ae0cd6e130c3643622&w=1380",
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex flex-col overflow-x-auto">
      <div className="rounded-md border overflow-x-auto flex-1 min-w-full max-w-[50vw]">
        <Table className="min-w-full w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="uppercase font-medium bg-[#f8fbfc] py-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (!cell.id.includes("select")) {
                          // router.push(`/staff/${row.getValue("id")}`);
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTable;
