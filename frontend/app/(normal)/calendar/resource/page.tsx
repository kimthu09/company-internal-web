import BookedResourceView from "@/components/calendar/resources/booked-resource-view";
import BookingItemSkeleton from "@/components/calendar/resources/booking-item-skeleton";
import { Suspense } from "react";

const BookResourceManage = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<BookingItemSkeleton />}>
        <BookedResourceView selectedPage={0} />
      </Suspense>
    </div>
  );
};

export default BookResourceManage;
