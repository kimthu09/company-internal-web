import AddNewEmployee from "@/components/manage/employee/add-new-employee";
import { withAuth } from "@/lib/auth/withAuth";

const AddNewEmployeeScreen = () => {
  return <AddNewEmployee />;
};

export default withAuth(AddNewEmployeeScreen, ["ADMIN"]);
