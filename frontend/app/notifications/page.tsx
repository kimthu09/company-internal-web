import BookingItemSkeleton from "@/components/calendar/resources/booking-item-skeleton";
import NotiPage from "@/components/notification/notification-page";
import { Suspense } from "react";

const NotificationManage = async () => {
  return (
    <div className="card___style">
      <Suspense fallback={<BookingItemSkeleton />}>
        <NotiPage />
      </Suspense>
    </div>
  );
};

export default NotificationManage;
