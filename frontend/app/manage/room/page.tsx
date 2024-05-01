import RoomTable from "@/components/manage/room/table";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import React, { Suspense } from "react";

const RoomManage = () => {
  return (
    <div className="card___style">
      <Suspense
        fallback={
          <TableSkeleton
            isHasExtensionAction={false}
            isHasFilter={true}
            isHasSearch={true}
            isHasChooseVisibleRow={false}
            isHasCheckBox={false}
            isHasPaging={true}
            numberRow={5}
            cells={[
              {
                percent: 1,
              },
              {
                percent: 5,
              },
              {
                percent: 1,
              },
            ]}
          ></TableSkeleton>
        }
      >
        <RoomTable />
      </Suspense>
    </div>
  );
};

export default RoomManage;
