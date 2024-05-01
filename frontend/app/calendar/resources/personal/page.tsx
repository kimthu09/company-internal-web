import BookedResourceView from "@/components/calendar/resources/booked-resource-view";
import BookingItemSkeleton from "@/components/calendar/resources/booking-item-skeleton";
import { Suspense } from "react";

const PersonalBookedPage = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<BookingItemSkeleton />}>
        <BookedResourceView isPersonal selectedPage={1} />
      </Suspense>
    </div>
  );
};

export default PersonalBookedPage;
