"use client";
import getUnit from "@/lib/unit/getUnit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPhoneAlt } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import UnitEmployeeSkeleton from "@/components/manage/unit/unit-employee-skeleton";
import UnitTitleLinks from "@/components/manage/unit/unit-title-links";
import { useCurrentUser } from "@/hooks/use-user";
import { includesRoles, isViewUnit } from "@/lib/utils";
import NoRole from "@/components/no-role";
const UnitEmployee = ({ params }: { params: { unitId: string } }) => {
  const { data, isLoading, isError, mutate } = getUnit(params.unitId);
  const { currentUser } = useCurrentUser();
  const canView =
    !currentUser ||
    (currentUser &&
      (includesRoles({
        currentUser: currentUser,
        roleCodes: ["ADMIN"],
      }) ||
        isViewUnit({ currentUser: currentUser, unitId: params.unitId })));
  if (isLoading || !currentUser) return <UnitEmployeeSkeleton />;
  else if (!canView) {
    return <NoRole />;
  } else if (isError) return <div>Failed to load</div>;
  else
    return (
      <div className="card___style flex flex-col">
        <UnitTitleLinks data={data} selectedPage={1} />
        <div className="flex flex-col">
          {data.staffs.map((item) => {
            return (
              <div
                key={item.id}
                className="grid grid-cols-3 gap-2 py-4 border-b items-center text-muted-foreground"
              >
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={item.image} alt="avatar" />
                    <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-black text-base">{item.name}</h3>
                </div>
                <div className="col-span-2 flex justify-between flex-wrap gap-2">
                  <div className="text-sm leading-6 flex gap-1 items-center">
                    <TbMailFilled className="text-rose-400 h-4 w-4" />
                    {item.email}
                  </div>
                  <div className="text-sm leading-6  text-right flex gap-1 items-center">
                    <FaPhoneAlt className="text-green-hover" />
                    {item.phone}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
};

export default UnitEmployee;
