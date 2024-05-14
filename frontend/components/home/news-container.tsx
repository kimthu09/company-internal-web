"use client";
import ViewMoreLink from "./view-more-link";
import getAllPosts from "@/lib/post/getAllPost";
import { News } from "@/types";
import NewsListItemSkeleton from "../news/news-list-item-skeleton";
import NewsListItem from "../news/news-list-item";

const NewsContainer = ({
  limit,
  tagId,
  title,
  viewMoreHref,
}: {
  limit?: string;
  tagId?: string;
  title: string;
  viewMoreHref: string;
}) => {
  const filter = {
    page: "1",
    limit: limit ?? "10",
    ...(tagId && { tags: tagId }),
  };
  const { posts, mutate, isLoading, isError } = getAllPosts({
    filter: filter,
  });
  if (isLoading) {
    return <NewsListItemSkeleton number={3} />;
  } else if (isError || posts.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  }
  return (
    <div className="p-7 rounded-2xl bg-white shadow-[0_3px_20px_#1d26260d] flex flex-col">
      <h1 className="pb-5 border-b text-xl font-bold">{title}</h1>
      {posts.data.map((item: News) => (
        <NewsListItem key={item.id} item={item} />
      ))}
      <ViewMoreLink href={viewMoreHref} />
    </div>
  );
};

export default NewsContainer;
