import React from "react";
import { Skeleton } from "../ui/skeleton";

const NewsListItemSkeleton = ({ number }: { number: number }) => {
  return (
    <div className="flex flex-col">
      {[...Array(number)].map((_, index) => (
        <div key={index} className={`py-4 my-2 flex flex-row gap-3`}>
          <Skeleton className="w-2/5 rounded-2xl h-36" />
          <div className="flex flex-col gap-3 self-center flex-1">
            <Skeleton className="w-1/5 h-9" />
            <Skeleton className="w-4/5 h-9" />
            <div className="flex flex-row text-xs text-muted-foreground items-start">
              <Skeleton className="w-2/5 h-9" />

              <Skeleton className="w-2/5 h-9 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsListItemSkeleton;
