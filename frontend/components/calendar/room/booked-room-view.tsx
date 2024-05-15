"use client";
import { useState } from "react";
import { format } from "date-fns";
import DaypickerPopup from "@/components/ui/daypicker-popup";
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
import { Button } from "@/components/ui/button";
import { vi } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AiOutlineClose } from "react-icons/ai";
import { includesRoles, stringToDate } from "@/lib/utils";
import BookingItemSkeleton from "../resources/booking-item-skeleton";
import CalendarLink from "./links-item";
import getAllRoomBooking from "@/lib/room/getAllRoomBooking";
import RoomList from "@/components/manage/room/room-list";
import BookingItemList, { BookingProps } from "./booking-item-list";
import StaffList from "@/components/manage/employee/staff-filter-list";
import { useCurrentUser } from "@/hooks/use-user";

type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
};
const BookedRoomView = ({
  isPersonal,
  selectedPage,
}: {
  isPersonal?: boolean;
  selectedPage: number;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "from", name: "Từ ngày" },
    { type: "to", name: "Đến ngày" },
    { type: "meetingRoom", name: "Phòng họp" },
  ];
  if (!isPersonal) {
    filterValues.push({ type: "createdBy", name: "Người tạo" });
  }
  const [latestFilter, setLatestFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
    });
    setOpenFilter(false);
    router.push(
      `/calendar/room${isPersonal ? "/personal" : ""}?${stringToFilter}`
    );
  };
  const { bookings, mutate, isLoading, isError } = getAllRoomBooking({
    encodedString: filterString,
    isPersonal: isPersonal,
  });

  const onDelete = () => {
    mutate();
  };
  const { currentUser } = useCurrentUser();
  const isAdmin =
    currentUser &&
    includesRoles({ currentUser: currentUser, roleCodes: ["ADMIN"] });
  if (isLoading) {
    return <BookingItemSkeleton />;
  } else if (isError) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div className="w-full flex flex-col overflow-x-auto">
        <CalendarLink selectedPage={selectedPage} />
        <div className="flex gap-2 mb-7 items-start">
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
                          {item.type === "to" || item.type === "from" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => {
                                var dateObject = stringToDate(field.value);
                                return (
                                  <DaypickerPopup
                                    triggerClassname="flex-1"
                                    date={dateObject ?? new Date()}
                                    setDate={(date) =>
                                      field.onChange(
                                        format(date!, "dd/MM/yyyy", {
                                          locale: vi,
                                        })
                                      )
                                    }
                                  />
                                );
                              }}
                            />
                          ) : item.type === "meetingRoom" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => (
                                <RoomList
                                  isId
                                  room={field.value}
                                  setRoom={(unit: string | number) =>
                                    field.onChange(unit)
                                  }
                                />
                              )}
                            />
                          ) : item.type === "createdBy" ? (
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
                      if (value === "to" || value === "from") {
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
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {bookings.data.length > 0 ? (
          bookings.data.map(
            (item: {
              date: string;
              day: BookingProps[];
              night: BookingProps[];
            }) => {
              return (
                <BookingItemList
                  isPersonal={isPersonal}
                  prop={item.date}
                  key={item.date}
                  dayArray={item.day}
                  nightArray={item.night}
                  onDeleted={onDelete}
                  isAdmin={isAdmin}
                />
              );
            }
          )
        ) : (
          <div className="flex justify-center py-20">
            Không tìm thấy kết quả.
          </div>
        )}
      </div>
    );
  }
};

export default BookedRoomView;
