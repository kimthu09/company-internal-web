import LeaveTable from "@/components/leave/table";
import NotiListSkeleton from "@/components/notification/noti-list-skeleton";
import { withAuth } from "@/lib/auth/withAuth";
import React, { Suspense } from "react";

const LeaveScreen = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<NotiListSkeleton number={5} />}>
        <LeaveTable />
      </Suspense>
    </div>
  );
};

export default withAuth(LeaveScreen, [], ["ADMIN"]);
