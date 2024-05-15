import AddUnit from "@/components/manage/unit/add-unit";
import { withAuth } from "@/lib/auth/withAuth";

const AddUnitScreen = () => {
  return <AddUnit />;
};

export default withAuth(AddUnitScreen, ["ADMIN"]);
