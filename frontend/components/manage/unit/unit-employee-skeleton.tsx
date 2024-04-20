import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UnitEmployeeSkeleton = () => {
  return (
    <div className="card___style flex flex-col">
      <div className="pb-5 border-b w-full flex flex-row gap-5 items-end flex-wrap">
        <Skeleton className="w-80 h-9" />
        <Skeleton className="w-48 h-8 ml-auto" />
      </div>
      <div className="flex flex-col">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 py-4 border-b items-center text-muted-foreground"
          >
            <div className="flex gap-4 items-center">
              <Skeleton className="w-10 h-10 rounded-full" />

              <Skeleton className="w-3/5 h-9" />
            </div>
            <div className="col-span-2 flex justify-between flex-wrap gap-2">
              <Skeleton className="w-72 h-8" />

              <Skeleton className="w-28 h-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitEmployeeSkeleton;
