import BookSkeleton from "@/components/calendar/resources/book-skeleton";
import BookRoom from "@/components/calendar/room/book-room";
import { Suspense } from "react";

const BookRoomPage = () => {
  return (
    <Suspense fallback={<BookSkeleton />}>
      <BookRoom />
    </Suspense>
  );
};

export default BookRoomPage;
