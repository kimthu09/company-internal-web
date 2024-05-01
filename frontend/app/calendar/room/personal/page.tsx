import BookingItemSkeleton from "@/components/calendar/resources/booking-item-skeleton";
import BookedRoomView from "@/components/calendar/room/booked-room-view";
import { Suspense } from "react";

const PersonalRoomBook = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<BookingItemSkeleton />}>
        <BookedRoomView isPersonal selectedPage={1} />
      </Suspense>
    </div>
  );
};

export default PersonalRoomBook;
