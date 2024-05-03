import React from "react";
import { Skeleton } from "../ui/skeleton";

const NotiListSkeleton = ({ number }: { number: number }) => {
  return [...Array(number)].map((_, index) => (
    <div key={index} className={`py-4 my-2 flex flex-row gap-3`}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-20 flex-1" />
    </div>
  ));
};

export default NotiListSkeleton;
