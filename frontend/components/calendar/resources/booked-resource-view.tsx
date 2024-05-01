"use client";
import getAllResourceBooking from "@/lib/resources/getAllResourceBooking";
import BookingItem from "./booking-item";
import BookingItemSkeleton from "./booking-item-skeleton";
import CalendarLink from "./links-item";
import { useState } from "react";
import { addDays, format } from "date-fns";
import DaypickerPopup from "@/components/ui/daypicker-popup";
import { Button } from "@/components/ui/button";

const BookedResourceView = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    addDays(new Date(), -5)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    addDays(new Date(), 5)
  );

  const { bookings, mutate, isLoading, isError } = getAllResourceBooking({
    // filter: {
    //   page: page,
    // },
  });
  if (isLoading) {
    return <BookingItemSkeleton />;
  } else if (isError) {
    return <div>Failed to load</div>;
  } else {
    const propKeys = Object.keys(bookings.data);
    return (
      <div className="w-full flex flex-col overflow-x-auto">
        <CalendarLink selectedPage={0} />
        <div className="flex gap-2 mb-7 items-center">
          <DaypickerPopup
            toDate={toDate}
            date={fromDate}
            setDate={setFromDate}
            triggerClassname="w-auto"
          />
          <DaypickerPopup
            fromDate={fromDate}
            date={toDate}
            setDate={setToDate}
            triggerClassname="w-auto"
          />
          <Button variant={"outline"} onClick={() => {}}>
            Xem
          </Button>
        </div>

        {propKeys.map((prop) => {
          const prop_data: any = bookings.data[prop];
          return (
            <BookingItem
              prop={prop}
              key={prop}
              dayArray={prop_data.day}
              nightArray={prop_data.night}
            />
          );
        })}
      </div>
    );
  }
};

export default BookedResourceView;
