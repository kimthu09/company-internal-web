"use client";
import { calendarLinks } from "@/constants";
import Link from "next/link";
import React from "react";

const CalendarLink = ({ selectedPage }: { selectedPage: number }) => {
  return (
    <div className="pb-5 border-b w-full flex flex-row gap-5 items-end flex-wrap mb-7">
      <h1 className="table___title">Lịch phòng họp</h1>
      {calendarLinks.map((item, index) => (
        <Link
          key={item.value}
          className={`${
            selectedPage === index
              ? "text-blue-primary"
              : "text-muted-foreground"
          } hover:text-blue-primary transition-colors font-medium tracking-wide whitespace-nowrap`}
          href={`/calendar/room${item.href}`}
        >
          {item.label}
        </Link>
      ))}
      <Link className="link___primary ml-auto" href={"/calendar/room/book"}>
        Đặt lịch
      </Link>
    </div>
  );
};

export default CalendarLink;
