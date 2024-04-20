"use client";

import UnitDetailSkeleton from "@/components/manage/unit/unit-detail.skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import getUnit from "@/lib/unit/getUnit";
import Link from "next/link";

export const links = [
  {
    value: "info",
    label: "Thông tin",
    href: "",
  },
  {
    value: "employee",
    label: "Nhân viên",
    href: "/employee",
  },
  {
    value: "calendar",
    label: "Lịch",
    href: "/calendar",
  },
];

const UnitDetail = ({ params }: { params: { unitId: string } }) => {
  const selectedPage = 0;
  const { data, isLoading, isError, mutate } = getUnit(params.unitId);
  if (isLoading) return <UnitDetailSkeleton />;
  else if (isError) return <div>Failed to load</div>;
  else
    return (
      <div className="card___style flex flex-col whitespace-nowrap">
        <div className="pb-5 border-b w-full flex flex-row gap-5 items-end">
          <h1 className="table___title uppercase">{data.name}</h1>
          {links.map((item, index) => (
            <Link
              key={item.value}
              className={`${
                selectedPage === index
                  ? "text-blue-primary"
                  : "text-muted-foreground"
              } hover:text-blue-primary transition-colors font-medium tracking-wide`}
              href={`/manage/unit/${params.unitId}${item.href}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 py-7 border-b justify-between">
          {data.manager ? (
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={data.manager.image} alt="avatar" />
                <AvatarFallback>
                  {data.manager.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="uppercase leading-6 text-base font-light">
                  Trưởng phòng
                </span>
                <span className="capitalize leading-6 text-base">
                  {data.manager.name}
                </span>
                <span className="text-sm leading-6 font-light">
                  {data.manager.email} | {data.manager.phone}
                </span>
              </div>
            </div>
          ) : (
            <span>Không có trưởng phòng</span>
          )}

          <Button className="font-semibold tracking-widest rounded-full hover:bg-hover-accent">
            Sửa
          </Button>
        </div>
        <div className="flex flex-col py-7">
          <div className="flex justify-between">
            <label className="font-medium text-black" htmlFor="features">
              Chức năng
            </label>
            <Button className="font-semibold tracking-widest rounded-full hover:bg-hover-accent">
              Sửa
            </Button>
          </div>

          <div className="col-span-2 grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-x-4 mt-4 items-end">
            {data.features.map((item) => (
              <div key={item.id} className="flex gap-1 items-baseline">
                <Checkbox
                  id={item.name}
                  checked={item.has}
                  // onClick={() => onSelect(item.id)}
                ></Checkbox>
                <label
                // onClick={() => onSelect(item.id)}
                >
                  {item.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default UnitDetail;
