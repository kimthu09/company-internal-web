import { Skeleton } from "@/components/ui/skeleton";

const ItemListSkeleton = () => {
  return [...Array(5)].map((_, index) => (
    <Skeleton key={index} className="h-20 w-full" />
  ));
};

export default ItemListSkeleton;
