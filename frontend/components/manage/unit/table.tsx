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
import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Unit } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import getAllUnits from "@/lib/unit/getAllUnits";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuFilter } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";
import UnitList from "./unit-list";
type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
};

const columns: ColumnDef<Unit>[] = [
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
      return <span>Tên phòng</span>;
    },
    cell: ({ row }) => (
      <Link
        className="capitalize leading-6 text-base link___primary"
        href={`/manage/unit/${row.original.id}`}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "image",
    header: () => {},
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Avatar>
          <AvatarImage src={row.original.manager.image} alt="avatar" />
          <AvatarFallback>
            {row.original.manager.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "manager",
    header: ({ column }) => {
      return <span>Trưởng phòng</span>;
    },
    cell: ({ row }) => (
      <div className="leading-6 flex flex-col">
        <span className="capitalize leading-6 text-base">
          {row.original.manager.name}
        </span>
        <span className="text-sm leading-6 font-light">
          {row.original.manager.email} | {row.original.manager.phone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "staffs",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <span>Số nhân viên</span>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="leading-6 flex flex-col text-right">
        <span>{row.original.numberStaffs.toLocaleString()}</span>
      </div>
    ),
  },
];
const UnitTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "name", name: "Tên phòng ban" },
    { type: "manager", name: "Tên trưởng phòng" },
  ];
  const [latestFilter, setLatestFilter] = useState("");
  Array.from(searchParams.keys()).forEach((key: string) => {
    if (searchParams.get(key) && key !== "page") {
      filters.push({ type: key, value: searchParams.get(key)! });
    }
  });
  const { register, handleSubmit, reset, control, getValues } =
    useForm<FormValues>({
      defaultValues: {
        filters: filters,
      },
    });
  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: "filters",
  });
  const filterString = filters
    .map((item) => `${item.type}=${encodeURIComponent(item.value.toString())}`)
    .join("&");
  const { units, mutate, isLoading, isError } = getAllUnits({
    encodedString: filterString,
    filter: {
      page: page,
    },
  });
  const data = units?.data;
  const [openFilter, setOpenFilter] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
    });
    setOpenFilter(false);
    router.push(`/manage/unit?page=1${stringToFilter}`);
  };

  if (isLoading) {
    return (
      <TableSkeleton
        isHasExtensionAction={false}
        isHasFilter={true}
        isHasSearch={true}
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
    );
  } else if (isError || units.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  } else
    return (
      <div className="w-full flex flex-col overflow-x-auto">
        <div className="mb-7 flex gap-3">
          <Popover
            open={openFilter}
            onOpenChange={(open) => {
              setOpenFilter(open);
              reset({ filters: filters });
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" className="lg:px-3 px-2 rounded-full">
                Lọc danh sách
                <LuFilter className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 ml-12 rounded-xl">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị danh sách theo
                  </p>
                </div>
                <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto pb-[1px] pl-[1px]">
                  {fields.map((item, index) => {
                    const name = filterValues.find((v) => v.type === item.type);
                    return (
                      <div key={item.id}>
                        <label className="text-sm text-muted-foreground">
                          {name?.name}
                        </label>
                        <div className=" flex gap-1 items-center">
                          <Input
                            {...register(`filters.${index}.value`)}
                            className="flex-1 rounded-full"
                            type="text"
                          ></Input>
                          <Button
                            variant={"ghost"}
                            className={`h-9 w-9 p-0 rounded-full`}
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <AiOutlineClose />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-[310px]">
                  <Select
                    value={latestFilter}
                    onValueChange={(value: string) => {
                      append({ type: value, value: "" });
                    }}
                  >
                    <SelectTrigger
                      disabled={fields.length === filterValues.length}
                      className="w-full flex justify-center h-10 rounded-full mt-[1px] px-3 text-muted-foreground"
                    >
                      <SelectValue placeholder=" Chọn điều kiện lọc" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {filterValues.map((item) => {
                          return fields.findIndex(
                            (v) => v.type === item.type
                          ) === -1 ? (
                            <SelectItem key={item.type} value={item.type}>
                              {item.name}
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className={`bg-green-primary h-9 rounded-full px-3 hover:bg-green-hover w-[310px]`}
                >
                  Lọc danh sách
                  <LuFilter className="ml-1 h-5 w-5" />
                </Button>
              </form>
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 mt-2 flex-wrap">
            {filters.map((item, index) => {
              const name = filterValues.find((v) => v.type === item.type);
              return (
                <div
                  key={item.type}
                  className="rounded-xl flex self-start px-3 py-1 h-fit outline-none text-sm text-primary bg-primary/10 items-center gap-1 whitespace-nowrap"
                >
                  <p>
                    {name?.name}
                    {": "}
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
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
      </div>
    );
};

export default UnitTable;
