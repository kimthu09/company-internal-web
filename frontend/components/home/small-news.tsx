"use client";
import getAllPosts from "@/lib/post/getAllPost";
import Image from "next/image";
import { IoPersonOutline } from "react-icons/io5";
import NewsListItemSkeleton from "../news/news-list-item-skeleton";
import { News } from "@/types";
import { dateTimeStringFormat } from "@/lib/utils";
const SmallNews = () => {
  const filter = {
    page: "1",
    limit: "2",
    tags: "2",
  };
  const { posts, mutate, isLoading, isError } = getAllPosts({
    filter: filter,
  });
  if (isLoading) {
    return <NewsListItemSkeleton number={3} />;
  } else if (isError || posts.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  }
  return posts.data.map((item: News) => (
    <div className="rounded-xl card-shadow overflow-clip bg-white flex-1">
      <Image
        className="object-cover w-full aspect-[3/2]"
        src={item.image}
        alt="image"
        width={400}
        height={400}
      />
      <div className="flex flex-col gap-3 p-7">
        <div className="flex flex-row">
          {item.tags.map((tag) => (
            <h2
              key={tag.id}
              className="uppercase text-xs mr-4 hover:text-primary transition-colors"
            >
              {tag.name}
            </h2>
          ))}
        </div>
        <h2 className="text-xl font-bold">{item.title}</h2>
        <div className="flex flex-row text-xs text-muted-foreground items-start">
          <IoPersonOutline className="h-4 w-4" />
          <p className="text-sm ml-3">{item.createdBy.name}</p>
          <p className="ml-auto">{dateTimeStringFormat(item.updatedAt)} </p>
        </div>
      </div>
    </div>
  ));
};

export default SmallNews;
