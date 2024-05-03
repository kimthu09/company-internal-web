"use client";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Resource, Room } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import TableSkeleton from "@/components/skeleton/table-skeleton";

import { Input } from "@/components/ui/input";
import Paging from "@/components/paging";
import { FaPen, FaTrash } from "react-icons/fa";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useLoading } from "@/hooks/loading-context";
import { toast } from "@/components/ui/use-toast";
import getAllRoom from "@/lib/room/getAllRoom";
import AddRoom from "./add-room";
import deleteRoom from "@/lib/room/deleteRoom";
import EditRoom from "./edit-room";

const RoomTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const [inputValue, setInputValue] = useState<string>("");
  const [name, setName] = useState("");

  const { rooms, mutate, isLoading, isError } = getAllRoom({
    page: page,
    name: name,
  });
  const searchHandler = useCallback(() => {
    if (name !== inputValue.trim()) {
      setName(inputValue.trim());
    }
  }, [inputValue, name]);

  // EFFECT: Search Handler
  useEffect(() => {
    // Debounce search handler
    const timer = setTimeout(() => {
      searchHandler();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [searchHandler, inputValue]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { showLoading, hideLoading } = useLoading();
  const onDelete = async ({ id }: { id: number }) => {
    const response: Promise<any> = deleteRoom({
      id: id.toString(),
    });
    showLoading();
    const responseData = await response;
    hideLoading();
    if (
      responseData.hasOwnProperty("response") &&
      responseData.response.hasOwnProperty("data") &&
      responseData.response.data.hasOwnProperty("message") &&
      responseData.response.data.hasOwnProperty("status")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.response.data.message,
      });
    } else if (
      responseData.hasOwnProperty("code") &&
      responseData.code.includes("ERR")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Thành công",
        description: "Xoá phòng họp thành công",
      });
      mutate();
    }
  };
  const data = rooms?.data;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "id",
      header: () => {
        return (
          <div className="flex justify-end">
            <span>ID</span>
          </div>
        );
      },
      cell: ({ row }) => <div className="text-right">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <span>Tên phòng họp</span>;
      },
      cell: ({ row }) => (
        <span className="capitalize leading-6 text-base text-primary">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return <span>Vị trí</span>;
      },
      cell: ({ row }) => (
        <span className="capitalize leading-6 text-base">
          {row.original.location}
        </span>
      ),
    },
    {
      accessorKey: "edit",
      header: ({ column }) => {
        return <div className="flex justify-end">Thao tác</div>;
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <EditRoom room={row.original} onAdded={() => mutate()}>
            <Button size={"icon"} className="rounded-full">
              <FaPen />
            </Button>
          </EditRoom>
          <ConfirmDialog
            title={"Xác nhận"}
            description="Bạn xác nhận muốn xoá phòng họp này ?"
            handleYes={() => onDelete({ id: row.original.id })}
          >
            <Button
              size={"icon"}
              variant={"ghost"}
              className="rounded-full text-rose-500 hover:text-rose-600"
            >
              <FaTrash />
            </Button>
          </ConfirmDialog>
        </div>
      ),
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
  if (isError || (rooms && rooms.hasOwnProperty("message"))) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div>
        <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
          <h1 className="table___title">Danh sách phòng họp</h1>
          <AddRoom onAdded={() => mutate()} />
        </div>
        <div className="w-full flex flex-col overflow-x-auto">
          <Input
            placeholder="Nhập tên để tìm kiếm"
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            id="name"
            className="rounded-full mb-4 mt-[1px] w-[99%] self-center"
          ></Input>
          {isLoading ? (
            <TableSkeleton
              isHasExtensionAction={false}
              isHasFilter={false}
              isHasSearch={false}
              isHasChooseVisibleRow={false}
              isHasCheckBox={false}
              isHasPaging={true}
              numberRow={5}
              cells={[
                {
                  percent: 1,
                },
                {
                  percent: 5,
                },
                {
                  percent: 1,
                },
              ]}
            ></TableSkeleton>
          ) : (
            <>
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
                              className="text-gray-text"
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
              <div className="flex items-center justify-end space-x-2 py-4">
                <Paging
                  page={page}
                  totalPage={rooms.paging.totalPages}
                  onNavigateBack={() =>
                    router.push(`/manage/room?page=${Number(page) - 1}`)
                  }
                  onNavigateNext={() =>
                    router.push(`/manage/room?page=${Number(page) + 1}`)
                  }
                  onPageSelect={(selectedPage) =>
                    router.push(`/manage/room?page=${selectedPage}`)
                  }
                  onNavigateLast={() =>
                    router.push(`/manage/room?page=${rooms.paging.totalPages}`)
                  }
                  onNavigateFirst={() => router.push(`/manage/room?page=${1}$`)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default RoomTable;
