import UnitTable from "@/components/manage/unit/table";
import Link from "next/link";

const UnitManage = () => {
  return (
    <div className="card___style">
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Danh sách phòng ban</h1>
        <Link className="link___primary" href={"/manage/unit/add"}>
          Thêm phòng ban
        </Link>
      </div>
      <UnitTable />
    </div>
  );
};

export default UnitManage;
