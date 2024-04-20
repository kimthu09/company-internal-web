import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const DetailSkeleton = () => {
  return (
    <div className="card___style flex sm:flex-row flex-col-reverse gap-8">
      <div className="flex-1 flex-col flex gap-4">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
      <Skeleton className="w-40 h-40 rounded-full" />
    </div>
  );
};

export default DetailSkeleton;
