"use client";
import NewsContainer from "./news-container";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import Noti from "./noti";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import SmallNews from "./small-news";

const HomePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const activeDays = [
    new Date(2024, 3, 15),
    new Date(2024, 3, 14),
    new Date(2024, 3, 11),
    new Date(2024, 3, 12),
    new Date(2024, 3, 10),
  ];
  const activeStyle = { border: "solid black" };

  return (
    <div className="flex xl:flex-row flex-col-reverse">
      <div className="flex flex-col gap-8 xl:mr-8">
        <NewsContainer />
        <NewsContainer />
      </div>
      <div className="flex flex-col flex-1 justify-start gap-8 mb-8">
        <div className="flex 2xl:flex-row  xl:flex-col-reverse sm:flex-row flex-col gap-8">
          <Noti />
          <div className="flex justify-center rounded-xl card-shadow bg-white lg:min-w-[24rem]">
            <Calendar
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
              selected={date}
            />
          </div>
        </div>
        <div className="flex 2xl:flex-row xl:flex-col sm:flex-row flex-col gap-8">
          <SmallNews />
          <SmallNews />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
