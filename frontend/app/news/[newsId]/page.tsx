import NewsDetail from "@/components/news/news_detail";

const NewsDetailPage = ({ params }: { params: { newsId: number } }) => {
    return <NewsDetail params={params} />;
};

export default NewsDetailPage;