"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuFilter } from "react-icons/lu";
import getAllNotifications from "@/lib/notification/getAllNotifications";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Button } from "../ui/button";
import NotificationItem from "./notification-item";
import { Notification } from "@/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { stringToDate } from "@/lib/utils";
import DaypickerPopup from "../ui/daypicker-popup";
import StaffList from "../manage/employee/staff-filter-list";
import { AiOutlineClose } from "react-icons/ai";
import ViewMoreLink from "../home/view-more-link";
import CreateNotification from "./create-notification";
import { toast } from "../ui/use-toast";
import markAllSeen from "@/lib/notification/markAllSeen";
import { useLoading } from "@/hooks/loading-context";
import NotiListSkeleton from "./noti-list-skeleton";
import { endpoint } from "@/constants";
import { useSWRConfig } from "swr";
type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
};
const NotiPage = () => {
  const { mutate: mutate2 } = useSWRConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ?? "10";
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "sender", name: "Người gửi" },
    { type: "fromDate", name: "Từ ngày" },
    { type: "toDate", name: "Đến ngày" },
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
  const { notifications, mutate, isLoading, isError } = getAllNotifications({
    encodedString: filterString,
    filter: {
      page: "1",
      limit: limit,
    },
  });
  const { hideLoading, showLoading } = useLoading();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
    });
    setOpenFilter(false);
    router.push(`/notifications?limit=10${stringToFilter}`);
  };
  const onAllSeen = async () => {
    const response: Promise<any> = markAllSeen();
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
      mutate();
      mutate2(`${endpoint}/notification/number_unseen`);
    }
  };
  const [openFilter, setOpenFilter] = useState(false);
  if (isLoading) {
    return <NotiListSkeleton number={5} />;
  } else if (isError || notifications.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  }
  return (
    <div>
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Tất cả thông báo</h1>
        <CreateNotification onCreated={() => mutate()} />
      </div>
      <div className="w-full flex flex-col overflow-x-auto">
        <div className="mb-4 flex gap-3">
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
                          {item.type === "toDate" ||
                            item.type === "fromDate" ? (
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
                          ) : item.type === "sender" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => (
                                <StaffList
                                  isId
                                  staff={field.value}
                                  setStaff={(value: string | number) =>
                                    field.onChange(value)
                                  }
                                />
                              )}
                            />
                          ) : null}
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
                      if (value === "fromDate" || value === "toDate") {
                        append({
                          type: value,
                          value: format(new Date(), "dd/MM/yyyy", {
                            locale: vi,
                          }),
                        });
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
        <Button
          className="link___primary no-underline font-normal text-sm hover:no-underline ml-auto p-0"
          variant={"link"}
          type="button"
          onClick={() => onAllSeen()}
        >
          Đánh dấu đã xem tất cả
        </Button>
        {notifications.data.length > 0 ? (
          notifications.data.map((item: Notification) => (
            <NotificationItem
              key={item.id}
              item={item}
              onUpdated={() => mutate()}
            />
          ))
        ) : (
          <div className="flex justify-center py-20">
            Không tìm thấy kết quả.
          </div>
        )}
        {notifications.paging.limit < notifications.paging.totalElements ? (
          <div className="flex items-center justify-end space-x-2 py-4">
            <ViewMoreLink href={`/notifications?limit=${+limit + 10}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NotiPage;
