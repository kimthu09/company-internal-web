import NotiListSkeleton from "@/components/notification/noti-list-skeleton";
import NotiPage from "@/components/notification/notification-page";
import { Suspense } from "react";

const NotificationManage = async () => {
  return (
    <div className="card___style">
      <Suspense fallback={<NotiListSkeleton number={5} />}>
        <NotiPage />
      </Suspense>
    </div>
  );
};

export default NotificationManage;
