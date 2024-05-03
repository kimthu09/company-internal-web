import { useLoading } from "@/hooks/loading-context";
import getDetailNews from "@/lib/post/getDetailNews";
import Image from "next/image";

export const NewsDetail = ({ params }: { params: { newsId: number } }) => {
    const { showLoading, hideLoading } = useLoading();
    const {
        data: news,
        isLoading,
        isError,
        mutate,
    } = getDetailNews(params.newsId);


    return (
        <div>
            <Image
                className="object-contain w-full"
                src={news.image}
                alt="image"
                width={400}
                height={400}
            />
        </div>
    )
}

export default NewsDetail;