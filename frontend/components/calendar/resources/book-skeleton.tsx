import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import ItemListSkeleton from "./item-list-skeleton";

const BookSkeleton = () => {
  return (
    <div className="flex gap-7 md:flex-row flex-col">
      <div className="flex flex-col gap-7">
        <h1 className="table___title">Đặt lịch tài nguyên</h1>
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-96 w-full" />
      </div>
      <div className="flex flex-col flex-1 ">
        <Skeleton className="h-10 w-full" />

        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 grid-cols-2 gap-5 text-gray-text self-start w-full">
          <ItemListSkeleton />
        </div>
      </div>
    </div>
  );
};

export default BookSkeleton;
