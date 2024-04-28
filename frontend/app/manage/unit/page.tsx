import UnitTable from "@/components/manage/unit/table";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import Link from "next/link";
import { Suspense } from "react";

const UnitManage = () => {
  return (
    <div className="card___style">
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Danh sách phòng ban</h1>
        <Link className="link___primary" href={"/manage/unit/add"}>
          Thêm phòng ban
        </Link>
      </div>
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
        <UnitTable />
      </Suspense>
    </div>
  );
};

export default UnitManage;
