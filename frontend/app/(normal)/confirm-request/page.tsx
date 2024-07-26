import ConfirmList from "@/components/confirm/confirm-list";
import NotiListSkeleton from "@/components/notification/noti-list-skeleton";
import { withAuth } from "@/lib/auth/withAuth";
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

export default withAuth(ConfirmScreen, ["ADMIN"], undefined, true);
