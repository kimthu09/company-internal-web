"use client";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import getPersonalShift from "@/lib/unit/getPersonalShift";
import { cn, stringToDate } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { DayClickEventHandler, DayPicker, Modifiers } from "react-day-picker";
import { PiSun, PiSunHorizon } from "react-icons/pi";
// import "react-day-picker/dist/style.css";

function CalendarDayNight() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [position, setPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDayClick: DayClickEventHandler = (day, modifiers, e) => {
    setSelectedDay(day);

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ left: rect.left, top: rect.bottom });
  };
  const { data, isLoading, isError, mutate } = getPersonalShift({
    from: format(
      new Date(selectedDay!.getFullYear(), selectedDay!.getMonth(), 1),
      "dd/MM/yyyy",
      { locale: vi }
    ),
    to: format(
      addDays(
        new Date(selectedDay!.getFullYear(), selectedDay!.getMonth() + 1, 1),
        -1
      ),
      "dd/MM/yyyy",
      { locale: vi }
    ),
  });
  const [activeDays, setActiveDays] = useState<Date[]>([]);
  useEffect(() => {
    if (data) {
      const days = Object.keys(data.data);
      const dateList: Date[] = days
        .filter(
          (day) => data.data[day].day === true || data.data[day].night === true
        )
        .map((dateString) => stringToDate(dateString) ?? new Date());
      setActiveDays(dateList);
    }
  }, [data]);
  if (isError || (data && data.hasOwnProperty("message"))) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div>
        <Calendar
          selected={selectedDay}
          onDayClick={handleDayClick}
          classNames={{
            head_cell:
              "text-muted-foreground rounded-md lg:w-12 sm:w-10 w-12 font-normal text-[1rem]",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "lg:h-12 lg:w-12 sm:h-10 sm:w-10 w-12 h-12 p-0 font-normal aria-selected:opacity-100"
            ),
          }}
          modifiers={{ active: activeDays }}
          modifiersClassNames={{ active: "active-date" }}
          mode="single"
        />
        {selectedDay && position && (
          <div
            ref={dialogRef}
            style={{
              color: "white",
              fontSize: "0.875rem",
              fontWeight: "medium",
              position: "absolute",
              left: position.left,
              top: position.top,
              background: "#EEF6F7",
              padding: "10px",
              borderRadius: "8px",
              margin: "4px 0 0",
            }}
          >
            {data ? (
              <div className="flex gap-2">
                <PiSun
                  className={`w-6 h-6  ${
                    data.data[format(selectedDay, "dd/MM/yyyy", { locale: vi })]
                      .day === true
                      ? "text-green-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <PiSunHorizon
                  className={`w-6 h-6   ${
                    data.data[format(selectedDay, "dd/MM/yyyy", { locale: vi })]
                      .night === true
                      ? "text-green-primary"
                      : "text-muted-foreground"
                  } `}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default CalendarDayNight;
