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
import { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getAllEmployees from "@/lib/employee/getAllEmployees";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { LuFilter } from "react-icons/lu";
import Paging from "@/components/paging";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Employee } from "@/types";
import UnitList from "../unit/unit-list";
import Link from "next/link";
import deleteEmployee from "@/lib/employee/deleteEmployee";
import { useLoading } from "@/hooks/loading-context";
import { toast } from "@/components/ui/use-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { FaTrash } from "react-icons/fa";

type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
};

const EmployeeTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "name", name: "Họ tên" },
    { type: "email", name: "Email" },
    { type: "phone", name: "Số điện thoại" },
    { type: "monthDOB", name: "Tháng sinh" },
    { type: "yearDOB", name: "Năm sinh" },
    { type: "male", name: "Giới tính" },
    { type: "unit", name: "Phòng ban" },
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
  const { employees, mutate, isLoading, isError } = getAllEmployees({
    encodedString: filterString,
    filter: {
      page: page,
    },
  });
  const data = employees?.data;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<Employee>[] = [
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
        return <span>Tên nhân viên</span>;
      },
      cell: ({ row }) => (
        <div className="leading-6 flex flex-col">
          <Link
            href={`/manage/employee/${row.original.id}`}
            className="capitalize leading-6 text-base link___primary"
          >
            {row.getValue("name")}
          </Link>
          <span className="text-sm leading-6 font-light">
            {row.original.address}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return <span>Liên hệ</span>;
      },
      cell: ({ row }) => (
        <div className="leading-6 flex flex-col">
          <span>{row.original.email}</span>
          <span className="text-sm leading-6 font-light">
            {row.original.phone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "cccd",
      header: ({ column }) => {
        return <span>CCCD</span>;
      },
      cell: ({ row }) => <span>{row.original.userIdentity}</span>,
    },
    {
      accessorKey: "male",
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <span>Giới tính</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="leading-6 flex justify-center font-medium tracking-wider">
          <div
            className={`${
              row.original.male ? "text-cyan-600" : "text-rose-400"
            }`}
          >
            {row.original.male ? "Nam" : "Nữ"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "dob",
      header: ({ column }) => {
        return (
          <div className="flex justify-end">
            <span>Ngày sinh</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="leading-6 flex flex-col text-right">
          <span>{row.original.dob}</span>
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <span>Phòng</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="leading-6 flex justify-center">
          <div className=" px-3 py-1 bg-primary rounded-full text-sm text-white">
            {row.original.unit.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "edit",
      header: ({ column }) => {
        return <div className="flex justify-end">Thao tác</div>;
      },
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <ConfirmDialog
            title={"Xác nhận"}
            description="Bạn xác nhận muốn xoá nhân viên này ?"
            handleYes={() => onDelete({ id: row.original.id })}
          >
            <Button
              title="Xoá nhân viên"
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
  const { showLoading, hideLoading } = useLoading();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
    });
    setOpenFilter(false);
    router.push(`/manage/employee?page=1${stringToFilter}`);
  };
  const onDelete = async ({ id }: { id: number }) => {
    const response: Promise<any> = deleteEmployee({
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
        description: "Xoá nhân viên thành công",
      });
      mutate();
    }
  };
  const months = [
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];
  const [openFilter, setOpenFilter] = useState(false);

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
  } else if (isError || employees.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  } else {
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
                          {item.type === "unit" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => (
                                <UnitList
                                  isId={false}
                                  unit={field.value}
                                  setUnit={(unit: string | number) =>
                                    field.onChange(unit)
                                  }
                                />
                              )}
                            />
                          ) : item.type === "male" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value: string) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <SelectTrigger className="flex-1 h-10 rounded-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem key={"true"} value={"true"}>
                                        Nam
                                      </SelectItem>
                                      <SelectItem key={"false"} value={"false"}>
                                        Nữ
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          ) : item.type === "monthDOB" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onValueChange={(value: string) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full h-10 rounded-full">
                                    <SelectValue placeholder="Chọn tháng" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {months.map((item) => (
                                        <SelectItem
                                          key={item.value}
                                          value={item.value}
                                        >
                                          {item.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          ) : item.type === "yearDOB" ? (
                            <Input
                              {...register(`filters.${index}.value`)}
                              className="flex-1 rounded-full"
                              type="number"
                              min={1900}
                              max={2024}
                              title="Năm sinh không hợp lệ"
                            ></Input>
                          ) : (
                            <Input
                              {...register(`filters.${index}.value`)}
                              className="flex-1 rounded-full"
                              type="text"
                            ></Input>
                          )}
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
                    {item.type === "male"
                      ? item.value === "true"
                        ? "Nam"
                        : "Nữ"
                      : item.value}
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
                            // router.push(
                            //   `/manage/employee/${row.getValue("id")}`
                            // );
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
            totalPage={employees.paging.totalPages}
            onNavigateBack={() =>
              router.push(
                `/manage/employee?page=${Number(page) - 1}${filterString}`
              )
            }
            onNavigateNext={() =>
              router.push(
                `/manage/employee?page=${Number(page) + 1}${filterString}`
              )
            }
            onPageSelect={(selectedPage) =>
              router.push(
                `/manage/employee?page=${selectedPage}${filterString}`
              )
            }
            onNavigateLast={() =>
              router.push(
                `/manage/employee?page=${employees.paging.totalPages}${filterString}`
              )
            }
            onNavigateFirst={() =>
              router.push(`/manage/employee?page=${1}${filterString}`)
            }
          />
        </div>
      </div>
    );
  }
};

export default EmployeeTable;
