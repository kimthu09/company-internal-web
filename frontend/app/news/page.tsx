import PostPage from "@/components/news/post-page";
import NotiListSkeleton from "@/components/notification/noti-list-skeleton";
import { Suspense } from "react";

const NewsPage = () => {
  return (
    <div className="card___style">
      <Suspense fallback={<NotiListSkeleton number={5} />}>
        <PostPage />
      </Suspense>
    </div>
  );
};

export default NewsPage;
