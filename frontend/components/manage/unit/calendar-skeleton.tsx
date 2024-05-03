import { Skeleton } from "@/components/ui/skeleton";

const CalendarSkeleton = () => {
  return (
    <div className="grid grid-cols-8 gap-4">
      {[...Array(16)].map((_, index) => (
        <Skeleton key={index} className=" md:h-16 h-10 w-full" />
      ))}
    </div>
  );
};

export default CalendarSkeleton;
