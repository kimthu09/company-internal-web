"use client";

import UnitEmployeeSkeleton from "@/components/manage/unit/unit-employee-skeleton";
import UnitTitleLinks from "@/components/manage/unit/unit-title-links";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import changeUnitShift from "@/lib/unit/changeUnitShift";
import getGeneralUnitShift from "@/lib/unit/getGeneralUnitShift";
import getUnit from "@/lib/unit/getUnit";
import { shiftTypeToString } from "@/lib/utils";
import { ShiftType } from "@/types";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaPen } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";
import { PiSun, PiSunHorizon } from "react-icons/pi";

type WeekValue = {
  value: string;
  label: string;
  hasDayShift: boolean;
  hasNightShift: boolean;
};
interface ShiftsData {
  [key: string]: {
    hasDayShift: boolean;
    hasNightShift: boolean;
  };
}

const UnitCalendarPage = ({ params }: { params: { unitId: string } }) => {
  const { data: unit, isLoading, isError, mutate } = getUnit(params.unitId);
  const {
    data,
    isLoading: shiftLoading,
    isError: shiftError,
    mutate: shiftMutate,
  } = getGeneralUnitShift({ id: params.unitId });
  const [weeks, setWeeks] = useState<WeekValue[]>([
    { value: "MONDAY", label: "T2", hasDayShift: false, hasNightShift: false },
    { value: "TUESDAY", label: "T3", hasDayShift: false, hasNightShift: false },
    {
      value: "WEDNESDAY",
      label: "T4",
      hasDayShift: false,
      hasNightShift: false,
    },
    {
      value: "THURSDAY",
      label: "T5",
      hasDayShift: false,
      hasNightShift: false,
    },
    { value: "FRIDAY", label: "T6", hasDayShift: false, hasNightShift: false },
    {
      value: "SATURDAY",
      label: "T7",
      hasDayShift: false,
      hasNightShift: false,
    },
    { value: "SUNDAY", label: "CN", hasDayShift: false, hasNightShift: false },
  ]);
  const [readOnly, setReadOnly] = useState(true);
  const resetForm = () => {
    const updatedWeeks = weeks.map((week) => {
      const { value } = week;
      return {
        ...week,
        hasDayShift: data.shifts[value].hasDayShift || false,
        hasNightShift: data.shifts[value].hasNightShift || false,
      };
    });
    setWeeks(updatedWeeks);
  };
  const updateCalendar = ({
    weekDay,
    isDay,
    value,
  }: {
    weekDay: string;
    isDay: boolean;
    value: boolean;
  }) => {
    if (readOnly) {
      return;
    }
    const updatedWeeks = weeks.map((week) => {
      if (week.value === weekDay) {
        return {
          ...week,
          hasDayShift: isDay ? value : week.hasDayShift,
          hasNightShift: isDay ? week.hasNightShift : value,
        };
      }
      return week;
    });
    setWeeks(updatedWeeks);
  };
  const { showLoading, hideLoading } = useLoading();
  const changeUnit = async () => {
    if (!checkIsDirty()) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: "Không có thay đổi để chỉnh sửa",
      });
      return;
    }
    const shiftsObject = weeks.reduce((acc: ShiftsData, week) => {
      const { value, hasDayShift, hasNightShift } = week;
      acc[value] = { hasDayShift, hasNightShift };
      return acc;
    }, {});
    const response: Promise<any> = changeUnitShift({
      id: unit.id.toString(),
      shifts: shiftsObject,
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
        description: "Thay đổi lịch làm việc phòng ban thành công",
      });
      setReadOnly(true);
      shiftMutate();
    }
  };
  const checkIsDirty = () => {
    if (data) {
      for (const item of weeks) {
        if (
          item.hasDayShift !== data.shifts[item.value]?.hasDayShift ||
          item.hasNightShift !== data.shifts[item.value]?.hasNightShift
        ) {
          return true;
        }
      }
    }
    return false;
  };
  useEffect(() => {
    if (data) {
      resetForm();
    }
  }, [data]);
  if (isLoading) return <UnitEmployeeSkeleton />;
  else if (isError) return <div>Failed to load</div>;
  else
    return (
      <div className="card___style flex flex-col gap-7">
        <UnitTitleLinks data={unit} selectedPage={2} />
        <div className="flex justify-between">
          <h2 className="text-xl tracking-wide font-light">Lịch phòng ban</h2>
          {!readOnly ? (
            <div className="flex gap-2 ">
              <Button
                variant={"outline"}
                className="bg-white border-rose-700 text-rose-700 hover:text-rose-700 hover:bg-rose-50/30 px-2 flex gap-1 flex-nowrap whitespace-nowrap flex-1"
                onClick={() => {
                  setReadOnly(true);
                  resetForm();
                }}
              >
                <AiOutlineClose className="h-5 w-5" />
                Hủy
              </Button>
              <ConfirmDialog
                title={"Xác nhận"}
                description="Bạn xác nhận chỉnh sửa lịch phòng ban ?"
                handleYes={() => {
                  changeUnit();
                }}
              >
                <Button className="px-2 flex gap-1 flex-nowrap whitespace-nowrap flex-1 bg-green-primary hover:bg-green-hover">
                  <LuCheck className="h-5 w-5" />
                  Lưu
                </Button>
              </ConfirmDialog>
            </div>
          ) : (
            <Button
              title="Chỉnh sửa"
              className={`px-2 flex gap-1 flex-nowrap whitespace-nowrap ${
                readOnly ? "" : "hidden"
              }`}
              type="button"
              onClick={() => {
                setReadOnly(false);
              }}
            >
              <FaPen />
              Chỉnh sửa
            </Button>
          )}
        </div>

        {data ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-8 w-full gap-x-2">
              <span></span>
              {weeks.map((item) => (
                <h2 key={item.value} className="uppercase text-center ">
                  {item.label}
                </h2>
              ))}
            </div>
            <div className="grid grid-cols-8 w-full sm:gap-x-2 gap-x-1 gap-y-4">
              <div className="uppercase font-light w-20 flex gap-1 self-start items-center">
                <PiSun className="w-6 h-6 text-amber-500 " />
                <span className="md:block hidden">
                  {shiftTypeToString(ShiftType.DAY)}
                </span>
                <span className="md:hidden block">S</span>
              </div>
              {weeks.map((item, index) => (
                <div
                  onClick={() =>
                    updateCalendar({
                      weekDay: item.value,
                      isDay: true,
                      value: !item.hasDayShift,
                    })
                  }
                  key={index}
                  className={`p-[2px] rounded border-2 cursor-pointer ${
                    item.hasDayShift !== data.shifts[item.value].hasDayShift
                      ? "border-green-primary"
                      : "border-white"
                  }`}
                >
                  <div
                    className={`w-full md:h-16 h-10 transition-colors ${
                      item.hasDayShift === true
                        ? "bg-primary hover:bg-hover-accent"
                        : "bg-slate-300 hover:bg-slate-400/90"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-8 w-full sm:gap-x-2 gap-x-1">
              <div className="uppercase font-light w-20 flex gap-1 self-start items-center">
                <PiSunHorizon className="w-6 h-6 text-orange-500" />
                <span className="md:block hidden">
                  {shiftTypeToString(ShiftType.NIGHT)}
                </span>

                <span className="md:hidden block">C</span>
              </div>
              {weeks.map((item, index) => (
                <div
                  onClick={() =>
                    updateCalendar({
                      weekDay: item.value,
                      isDay: false,
                      value: !item.hasNightShift,
                    })
                  }
                  key={index}
                  className={`p-[2px] rounded border-2 cursor-pointer ${
                    item.hasNightShift !== data.shifts[item.value].hasNightShift
                      ? "border-green-primary"
                      : "border-white"
                  }`}
                >
                  <div
                    className={`w-full md:h-16 h-10 transition-colors  ${
                      item.hasNightShift === true
                        ? "bg-primary hover:bg-hover-accent"
                        : "bg-slate-300 hover:bg-slate-400/90"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>Hi</div>
        )}
      </div>
    );
};

export default UnitCalendarPage;
