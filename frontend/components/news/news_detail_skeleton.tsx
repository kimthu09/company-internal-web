import { Skeleton } from "../ui/skeleton"

export const NewsDetailSkeleton = () => {
    return (
        <div className="bg-white rounded-xl flex flex-col gap-4 bg p-7">
            <Skeleton className="h-64 w-full rounded" />
            <div className="flex flex-row gap-4 flex-wrap">
                <Skeleton className="h-8 w-24 rounded" />
                <Skeleton className="h-8 w-36 rounded" />
                <Skeleton className="h-8 w-12 rounded" />
            </div>
            <Skeleton className="h-12 w-56" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />

            <Skeleton className="h-20 w-full" />
        </div>

    )
}

export default NewsDetailSkeleton;