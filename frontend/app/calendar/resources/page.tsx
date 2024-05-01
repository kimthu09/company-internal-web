import BookedResourceView from "@/components/calendar/resources/booked-resource-view";
import TableSkeleton from "@/components/skeleton/table-skeleton";
import { Suspense } from "react";

const BookResourceManage = () => {
  return (
    <div className="card___style">
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
        <BookedResourceView />
      </Suspense>
    </div>
  );
};

export default BookResourceManage;
