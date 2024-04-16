import EmployeeTable from "@/components/manage/employee/table";
import React from "react";

const EmployeeManage = () => {
  return (
    <div className="col card___style">
      <div className="flex flex-row justify-between items-center pb-7">
        <div className="pb-5 border-b w-full">
          <h1 className="table___title">Danh sách nhân viên</h1>
        </div>
      </div>
      <EmployeeTable />
    </div>
  );
};

export default EmployeeManage;
