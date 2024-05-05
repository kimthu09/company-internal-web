"use client"

import { useLoading } from "@/hooks/loading-context";
import getDetailNews from "@/lib/post/getDetailNews";
import { dateTimeStringFormat } from "@/lib/utils";
import { News } from "@/types";
import { MailIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import NewsDetailSkeleton from "./news_detail_skeleton";
import Error from "@/app/error";


const EditorBlock = dynamic(() => import("./editor"), {
    ssr: false,
});

export const NewsDetail = ({ params }: { params: { newsId: number } }) => {
    const { showLoading, hideLoading } = useLoading();
    const [news, setNews] = useState<News>();
    const {
        data,
        isLoading,
        isError,
        mutate,
    } = getDetailNews(params.newsId);

    useEffect(() => {
        if (data && !data.hasOwnProperty("message")) {
            setNews(data)
        }
    }, [data]);

    if (isLoading) {
        return <NewsDetailSkeleton />
    }
    else if (news == undefined) {
        return <div>Failed to load</div>;
    }

    return (
        <div className="card-shadow bg-white rounded-xl p-0 overflow-clip basis-2/3">
            <div>
                <Image
                    className="w-full object-cover aspect-[4/1]"
                    src={news.image}
                    alt="image"
                    width={200}
                    height={50}
                />
            </div>
            <div className="py-7">
                <div className="flex flex-wrap gap-2 mx-7">
                    {
                        news.tags.map(tag => (<div className="rounded-full flex px-3 py-1 h-fit outline-none text-primary bg-primary/10 items-center gap-1">
                            {tag.name}
                        </div>))
                    }
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-black mt-4 mx-7">{news.title}</h1>
                <p className="mt-2 text-gray-text mt-4 mb-4 mx-7">Cập nhật lần cuối: {dateTimeStringFormat(news.updatedAt)}</p>
                <EditorBlock className="w-full" data={news.content} onChange={(content: OutputData) => { }} holder="editorjs-container" readonly={true} />
                <div className="bg-primary/10 rounded-xl p-4 flex flex-row gap-4 mx-7 -mt-32">
                    <Avatar>
                        <AvatarImage src={news.createdBy.image} alt="avatar" />
                        <AvatarFallback>
                            {news.createdBy.name.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <p className="text-gray-text">TÁC GIẢ</p>
                        <p className="bold text-lg">{news.createdBy.name}</p>
                        <p className="flex flex-row gap-1 text-gray-text"><span><MailIcon /></span> <a href={`mailto:${news.createdBy.email}`} className="hover:underline">
                            {news.createdBy.email}
                        </a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsDetail;