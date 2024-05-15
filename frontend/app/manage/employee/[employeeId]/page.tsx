import EmployeeEditDetail from "@/components/manage/employee/detail";
import { withAuth } from "@/lib/auth/withAuth";
import React from "react";

const EmployeeDetail = ({ params }: { params: { employeeId: string } }) => {
  return <EmployeeEditDetail params={params} />;
};

export default withAuth(EmployeeDetail, ["ADMIN"]);
