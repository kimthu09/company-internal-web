import BookResource from "@/components/calendar/resources/book-resource";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Suspense } from "react";

const BookResourcePage = () => {
  return (
    <Suspense
      fallback={
        <TableSkeleton
          isHasExtensionAction={false}
          isHasFilter={true}
          isHasSearch={true}
          isHasChooseVisibleRow={false}
          isHasCheckBox={false}
          isHasPaging={true}
          numberRow={5}
          cells={[
            {
              percent: 1,
            },
            {
              percent: 5,
            },
            {
              percent: 1,
            },
          ]}
        ></TableSkeleton>
      }
    >
      <BookResource />
    </Suspense>
  );
};

export default BookResourcePage;
