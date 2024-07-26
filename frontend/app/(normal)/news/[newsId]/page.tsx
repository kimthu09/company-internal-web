import NewsDetail from "@/components/news/news-detail";

const NewsDetailPage = ({ params }: { params: { newsId: number } }) => {
  return <NewsDetail params={params} />;
};

export default NewsDetailPage;
