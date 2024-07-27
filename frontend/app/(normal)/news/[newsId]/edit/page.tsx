import EditNews from "@/components/news/edit-news";

import { withAuth } from "@/lib/auth/withAuth";

const EditNewsPage = ({ params }: { params: { newsId: number } }) => {
  return <EditNews params={params} />;
};

export default withAuth(
  EditNewsPage,
  ["ADMIN", "POST"],
  undefined,
  undefined,
  true
);
