import EmployeeTable from "@/components/manage/employee/table";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { withAuth } from "@/lib/auth/withAuth";
import Link from "next/link";
import React, { Suspense } from "react";

const EmployeeManage = () => {
  return (
    <div className="card___style">
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Danh sách nhân viên</h1>
        <Link className="link___primary" href={"/manage/employee/add"}>
          Thêm nhân viên
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
        <EmployeeTable />
      </Suspense>
    </div>
  );
};

export default withAuth(EmployeeManage, ["ADMIN"]);
