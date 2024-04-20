import EmployeeEditDetail from "@/components/manage/employee/detail";
import React from "react";

const EmployeeDetail = ({ params }: { params: { employeeId: string } }) => {
  return <EmployeeEditDetail params={params} />;
};

export default EmployeeDetail;
