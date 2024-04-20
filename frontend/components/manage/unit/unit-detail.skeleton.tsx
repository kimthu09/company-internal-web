import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UnitDetailSkeleton = () => {
  return (
    <div className="card___style flex flex-col whitespace-nowrap">
      <div className="pb-5 border-b w-full flex flex-row gap-5 items-end">
        <Skeleton className="w-80 h-9" />
      </div>

      <div className="flex gap-4 py-7 border-b justify-between">
        <Skeleton className="w-64 h-10" />

        <Skeleton className="w-16 h-10" />
      </div>
      <div className="flex flex-col py-7">
        <div className="flex justify-between">
          <label className="font-medium text-black" htmlFor="features">
            Chức năng
          </label>
          <Skeleton className="w-16 h-10" />
        </div>

        <div className="col-span-2 grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-x-4 mt-4 items-end">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-32 h-8" />
        </div>
      </div>
    </div>
  );
};

export default UnitDetailSkeleton;
