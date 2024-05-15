"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LeaveRequest } from "@/types";
import ViewMoreLink from "../home/view-more-link";
import NotiListSkeleton from "../notification/noti-list-skeleton";
import { useLoading } from "@/hooks/loading-context";
import LeaveItem from "../leave/leave-item";
import getAllLeaveRequest from "@/lib/leave/getAllLeaveRequest";
import { useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LuFilter } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import { AiOutlineClose } from "react-icons/ai";
import DaypickerPopup from "../ui/daypicker-popup";
import { includesOneRoles, isManager, stringToDate } from "@/lib/utils";
import StatusList from "./status-list";
import ConfirmDialog from "../ui/confirm-dialog";
import passLeaveRequest from "@/lib/leave/passLeaveRequest";
import { toast } from "../ui/use-toast";
import { useCurrentUser } from "@/hooks/use-user";
import rejectLeaveRequest from "@/lib/leave/rejectLeaveRequest";
type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
};

const displayText: Record<string, { trueText: string; falseText: string }> = {
  isRejected: {
    trueText: "Đã từ chối",
    falseText: "Chưa từ chối",
  },
  isAccepted: {
    trueText: "Đã xác nhận",
    falseText: "Chưa xác nhận",
  },
  isApproved: {
    trueText: "Đã duyệt",
    falseText: "Chưa duyệt",
  },
};
const ConfirmList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const limit = searchParams.get("limit") ?? "10";
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "isRejected", name: "Từ chối" },
    { type: "isApproved", name: "Duyệt" },
    { type: "isAccepted", name: "Xác nhận" },

    { type: "dateFrom", name: "Từ ngày" },
    { type: "dateTo", name: "Đến ngày" },
  ];
  const [latestFilter, setLatestFilter] = useState("");
  Array.from(searchParams.keys()).forEach((key: string) => {
    if (searchParams.get(key) && key !== "limit") {
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
  const { requests, mutate, isLoading, isError } = getAllLeaveRequest({
    encodedString: filterString,
    filter: {
      page: "1",
      limit: limit,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
    });
    router.push(`/confirm-request?limit=10${stringToFilter}`);
  };
  const { showLoading, hideLoading } = useLoading();
  const onPassLeave = async ({ id }: { id: number }) => {
    const response: Promise<any> = passLeaveRequest({
      id: id,
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
        description: "Duyệt đơn xin nghỉ thành công",
      });
      mutate();
    }
  };
  const onRejectLeave = async ({ id }: { id: number }) => {
    const response: Promise<any> = rejectLeaveRequest({
      id: id,
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
        description: "Từ chối đơn xin nghỉ thành công",
      });
      mutate();
    }
  };
  const { currentUser } = useCurrentUser();
  const isManagerRole = currentUser && isManager({ currentUser: currentUser });
  const isFinalRole =
    currentUser &&
    includesOneRoles({
      currentUser: currentUser,
      roleCodes: ["ADMIN", "STAFF MANAGER"],
    });
  if (isLoading) {
    return <NotiListSkeleton number={5} />;
  } else if (isError || requests.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div>
        <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
          <h1 className="table___title">Đơn nghỉ phép</h1>
        </div>
        <div className="w-full flex flex-col">
          <div className="mb-4 flex gap-3">
            <Popover
              onOpenChange={(open) => {
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
                      const name = filterValues.find(
                        (v) => v.type === item.type
                      );
                      return (
                        <div key={item.id}>
                          <label className="text-sm text-muted-foreground">
                            {name?.name}
                          </label>
                          <div className=" flex gap-1 items-center">
                            {item.type === "dateTo" ||
                            item.type === "dateFrom" ? (
                              <Controller
                                control={control}
                                name={`filters.${index}.value`}
                                render={({ field }) => {
                                  return (
                                    <DaypickerPopup
                                      triggerClassname="flex-1"
                                      date={
                                        stringToDate(field.value) ?? new Date()
                                      }
                                      setDate={(date) => {
                                        if (date) {
                                          const formattedDate = format(
                                            date,
                                            "dd/MM/yyyy",
                                            { locale: vi }
                                          );
                                          field.onChange(formattedDate);
                                        } else {
                                          console.error("Invalid date:", date);
                                        }
                                      }}
                                    />
                                  );
                                }}
                              />
                            ) : (
                              <Controller
                                control={control}
                                name={`filters.${index}.value`}
                                render={({ field }) => {
                                  return (
                                    <StatusList
                                      status={field.value === "true"}
                                      setStatus={(value) =>
                                        field.onChange(value.toString())
                                      }
                                      display={displayText[item.type]}
                                    />
                                  );
                                }}
                              />
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
                        if (value === "dateFrom" || value === "dateTo") {
                          append({
                            type: value,
                            value: format(new Date(), "dd/MM/yyyy", {
                              locale: vi,
                            }),
                          });
                        } else if (value.includes("is")) {
                          append({ type: value, value: "false" });
                        } else {
                          append({ type: value, value: "" });
                        }
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
                    {item.type.includes("is") ? (
                      <p>
                        {item.value === "true"
                          ? displayText[item.type].trueText
                          : displayText[item.type].falseText}
                      </p>
                    ) : (
                      <p>
                        {name?.name}
                        {": "}
                        {item.value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {requests.data.length > 0 ? (
            requests.data.map((item: LeaveRequest) => (
              <div
                key={item.id}
                className="flex border-b border-b-border py-4 my-2 gap-2 flex-wrap sm:flex-row flex-col"
              >
                <LeaveItem className="flex-1" item={item} />
                <div className="flex ml-auto gap-2 flex-wrap">
                  {isManagerRole &&
                    !isFinalRole &&
                    !item.acceptedBy &&
                    !item.rejectedBy &&
                    !item.approvedBy && (
                      <ConfirmDialog
                        title={"Xác nhận"}
                        description="Bạn muốn xác nhận đơn xin nghỉ phép này?"
                        handleYes={() => {
                          onPassLeave({ id: item.id });
                        }}
                      >
                        <Button
                          title="Xác nhận"
                          className="font-semibold tracking-widest rounded-full bg-blue-primary/80 hover:bg-blue-primary/90 "
                        >
                          Xác nhận
                        </Button>
                      </ConfirmDialog>
                    )}
                  {!item.approvedBy && !item.rejectedBy && isFinalRole && (
                    <ConfirmDialog
                      title={"Xác nhận"}
                      description="Bạn xác nhận muốn duyệt đơn xin nghỉ phép này?"
                      handleYes={() => {
                        onPassLeave({ id: item.id });
                      }}
                    >
                      <Button
                        title="Duyệt"
                        className="font-semibold tracking-widest rounded-full bg-green-primary hover:bg-green-hover"
                      >
                        Duyệt
                      </Button>
                    </ConfirmDialog>
                  )}
                  {!item.approvedBy &&
                    !item.rejectedBy &&
                    (isManagerRole || isFinalRole) && (
                      <ConfirmDialog
                        title={"Xác nhận"}
                        description="Bạn xác nhận từ chối đơn xin nghỉ phép này?"
                        handleYes={() => {
                          onRejectLeave({ id: item.id });
                        }}
                      >
                        <Button
                          title="Từ chối"
                          className="font-semibold tracking-widest rounded-full 
                          bg-rose-400
                          hover:bg-rose-500/90"
                        >
                          Từ chối
                        </Button>
                      </ConfirmDialog>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-20">
              Không tìm thấy kết quả.
            </div>
          )}
          {requests.paging.limit < requests.paging.totalElements ? (
            <div className="flex items-center justify-end space-x-2 py-4">
              <ViewMoreLink href={`/confirm-request?limit=${+limit + 10}`} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
};

export default ConfirmList;
