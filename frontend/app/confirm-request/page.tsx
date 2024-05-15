import ConfirmList from "@/components/confirm/confirm-list";
import NotiListSkeleton from "@/components/notification/noti-list-skeleton";
import { Suspense } from "react";

const ConfirmScreen = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<NotiListSkeleton number={5} />}>
        <ConfirmList />
      </Suspense>
    </div>
  );
};

export default ConfirmScreen;
