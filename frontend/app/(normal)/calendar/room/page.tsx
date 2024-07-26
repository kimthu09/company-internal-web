import BookingItemSkeleton from "@/components/calendar/resources/booking-item-skeleton";
import BookedRoomView from "@/components/calendar/room/booked-room-view";
import { Suspense } from "react";

const BookRoomManage = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<BookingItemSkeleton />}>
        <BookedRoomView selectedPage={0} />
      </Suspense>
    </div>
  );
};

export default BookRoomManage;
