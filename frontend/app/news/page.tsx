import NewsListItemSkeleton from "@/components/news/news-list-item-skeleton";
import PostPage from "@/components/news/post-page";
import { Suspense } from "react";

const NewsPage = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<NewsListItemSkeleton number={3} />}>
        <PostPage />
      </Suspense>
    </div>
  );
};

export default NewsPage;
