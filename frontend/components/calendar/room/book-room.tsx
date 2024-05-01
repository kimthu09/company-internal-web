"use client";
import { Calendar } from "@/components/ui/calendar";
import { Room, ShiftType } from "@/types";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/use-toast";
import { shiftTypeToString } from "@/lib/utils";
import { useLoading } from "@/hooks/loading-context";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import SelectShift from "../resources/select-shift";
import ItemListSkeleton from "../resources/item-list-skeleton";
import getUnbookRooms from "@/lib/room/getUnBookRoomByDate";
import bookRoom from "@/lib/room/bookRoom";
const BookRoom = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>();
  const [filteredList, setFilteredList] = useState<Room[]>();
  const [fromShift, setFromShift] = useState(ShiftType.DAY.toString());
  const [toShift, setToShift] = useState(ShiftType.NIGHT.toString());
  const { showLoading, hideLoading } = useLoading();
  const onSubmit = async ({ roomId }: { roomId: string }) => {
    if (!date || (date && !date.from)) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: "Vui lòng chọn ngày để đặt",
      });
      return;
    } else if (date && date.from) {
      const response: Promise<any> = bookRoom({
        id: roomId,
        data: {
          from: {
            date: format(date?.from, "dd/MM/yyyy", {
              locale: vi,
            }),
            shiftType: fromShift,
          },
          to: {
            date: date.to
              ? format(date?.to, "dd/MM/yyyy", {
                  locale: vi,
                })
              : format(date?.from, "dd/MM/yyyy", {
                  locale: vi,
                }),
            shiftType: date.to ? toShift : fromShift,
          },
        },
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
          description: "Đặt lịch sử dụng phòng họp thành công",
        });
        fetchResources();
      }
    }
  };
  async function fetchResources() {
    if (!date || !date.from) {
      setRooms([]);
      return;
    }
    try {
      const fromDate = format(date?.from || new Date(), "dd/MM/yyyy", {
        locale: vi,
      });
      const toDate = format(date?.to || date?.from, "dd/MM/yyyy", {
        locale: vi,
      });

      const response = await getUnbookRooms({
        data: {
          from: { date: fromDate, shiftType: fromShift },
          to: { date: toDate, shiftType: date.to ? toShift : fromShift },
        },
      });

      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }
  useEffect(() => {
    fetchResources();
  }, []);

  const [inputValue, setInputValue] = useState<string>("");
  const searchHandler = useCallback(() => {
    const filteredData = rooms?.filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredList(filteredData);
  }, [inputValue, rooms]);

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
  return (
    <div className="flex gap-7 md:flex-row flex-col">
      <div className="flex flex-col gap-7">
        <h1 className="table___title">Đặt lịch phòng họp</h1>
        <div className="card-shadow bg-white rounded-xl flex flex-col md:self-start self-center md:sticky right-0 top-0">
          <div className="p-7 pb-0 flex text-gray-text items-center gap-7">
            <div className="flex gap-1 items-start flex-1">
              {date && date.from && date.to ? "Từ:" : "Ngày:"}
              <div className="flex flex-col gap-1">
                <span className="border rounded-full py-1 px-3 text-gray-text">
                  {date && date.from
                    ? format(date?.from, "dd/MM/yyyy", {
                        locale: vi,
                      })
                    : "Chọn ngày"}
                </span>
                <SelectShift value={fromShift} setValue={setFromShift} />
              </div>
            </div>
            {date && date.to && (
              <div className="flex gap-1 items-start flex-1">
                Đến:
                <div className="flex flex-col gap-1">
                  <span className="border rounded-full py-1 px-3 text-gray-text">
                    {date && date.to
                      ? format(date?.to, "dd/MM/yyyy", {
                          locale: vi,
                        })
                      : "Chọn ngày"}
                  </span>
                  <div className="self-end">
                    <SelectShift value={toShift} setValue={setToShift} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            className="mx-7 mt-4"
            variant={"outline"}
            onClick={() => fetchResources()}
          >
            Xem phòng họp
          </Button>
          <Calendar
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            mode="range"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 ">
        <Input
          placeholder="Nhập tên để tìm kiếm"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          id="name"
          className="rounded-full mb-4 mt-[1px] w-[99%] self-center bg-white"
        ></Input>
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 grid-cols-2 gap-5 text-gray-text self-start w-full">
          {!filteredList ? (
            <ItemListSkeleton />
          ) : (
            filteredList?.map((item) => {
              const dateString = `${
                date && date.from && date.to
                  ? `từ ${shiftTypeToString(fromShift)} ngày ${format(
                      date.from,
                      "dd/MM/yyyy",
                      {
                        locale: vi,
                      }
                    )} đến ${shiftTypeToString(toShift)} ngày ${format(
                      date.to,
                      "dd/MM/yyyy",
                      {
                        locale: vi,
                      }
                    )}`
                  : date && date.from && !date.to
                  ? `${shiftTypeToString(fromShift)} ngày ${format(
                      date.from,
                      "dd/MM/yyyy",
                      {
                        locale: vi,
                      }
                    )}`
                  : ""
              }`;
              return (
                <div
                  key={item.id}
                  className="card-shadow bg-white rounded-xl p-4 py-7 flex flex-col items-center justify-center relative overflow-clip cursor-pointer group hover:shadow-md"
                >
                  <span>{item.name}</span>
                  {item.location === item.name ? null : (
                    <span className="text-sm">({item.location})</span>
                  )}
                  <ConfirmDialog
                    title={`Xác nhận đặt dùng phòng ${item.name} ?`}
                    description={`Đặt dùng phòng ${item.name} ${dateString}`}
                    handleYes={() => {
                      onSubmit({ roomId: item.id.toString() });
                    }}
                  >
                    <Button className="absolute right-0 top-[-100%] shadow-none rounded-none rounded-bl-xl transition-all group-hover:top-0 hover:bg-hover-accent">
                      Đặt
                    </Button>
                  </ConfirmDialog>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
