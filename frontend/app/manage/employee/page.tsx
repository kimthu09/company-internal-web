import EmployeeTable from "@/components/manage/employee/table";
import Link from "next/link";
import React from "react";

const EmployeeManage = async () => {
  return (
    <div className="card___style">
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Danh sách nhân viên</h1>
        <Link className="link___primary" href={"/manage/employee/add"}>
          Thêm nhân viên
        </Link>
      </div>
      <EmployeeTable />
    </div>
  );
};

export default EmployeeManage;
