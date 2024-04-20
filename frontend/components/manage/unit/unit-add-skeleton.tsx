import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UnitAddSkeleton = () => {
  return [...Array(3)].map((_, index) => (
    <div key={index} className="flex gap-1 items-baseline">
      <Skeleton className="h-8 w-32" />
    </div>
  ));
};

export default UnitAddSkeleton;
