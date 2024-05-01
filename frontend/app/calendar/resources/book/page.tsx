import BookResource from "@/components/calendar/resources/book-resource";
import BookSkeleton from "@/components/calendar/resources/book-skeleton";
import { Suspense } from "react";

const BookResourcePage = () => {
  return (
    <Suspense fallback={<BookSkeleton />}>
      <BookResource />
    </Suspense>
  );
};

export default BookResourcePage;
