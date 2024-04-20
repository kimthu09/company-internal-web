"use client";
import { links } from "../page";
import Link from "next/link";
import getUnit from "@/lib/unit/getUnit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPhoneAlt } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import UnitEmployeeSkeleton from "@/components/manage/unit/unit-employee-skeleton";
const UnitEmployee = ({ params }: { params: { unitId: string } }) => {
  const selectedPage = 1;
  const { data, isLoading, isError, mutate } = getUnit(params.unitId);
  if (isLoading) return <UnitEmployeeSkeleton />;
  else if (isError) return <div>Failed to load</div>;
  else
    return (
      <div className="card___style flex flex-col">
        <div className="pb-5 border-b w-full flex flex-row gap-5 items-end flex-wrap">
          <h1 className="table___title uppercase">{data.name}</h1>
          {links.map((item, index) => (
            <Link
              key={item.value}
              className={`${
                selectedPage === index
                  ? "text-blue-primary"
                  : "text-muted-foreground"
              } hover:text-blue-primary transition-colors font-medium tracking-wide whitespace-nowrap`}
              href={`/manage/unit/${params.unitId}${item.href}`}
            >
              {item.label}
            </Link>
          ))}
          {selectedPage === 1 ? (
            <span className="whitespace-nowrap text-muted-foreground ml-auto">
              Tổng số nhân viên: {data.numberStaffs}
            </span>
          ) : null}
        </div>
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
                  <h3 className="text-black">{item.name}</h3>
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
