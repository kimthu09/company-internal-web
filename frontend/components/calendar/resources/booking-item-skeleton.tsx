import { Skeleton } from "@/components/ui/skeleton";

const BookingItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-7">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-12 w-full" />

      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex gap-7">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28 flex-1" />
          <Skeleton className="h-10 w-40 basis-2/5" />
        </div>
      ))}
    </div>
  );
};

export default BookingItemSkeleton;
