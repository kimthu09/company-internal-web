import UnitDetail from "@/components/manage/unit/unit-detail";
import UnitDetailSkeleton from "@/components/manage/unit/unit-detail.skeleton";
import { withAuth } from "@/lib/auth/withAuth";
import { Suspense } from "react";

const UnitDetailScreen = ({ params }: { params: { unitId: string } }) => {
  return (
    <Suspense fallback={<UnitDetailSkeleton />}>
      <UnitDetail params={params} />
    </Suspense>
  );
};

export default UnitDetailScreen;
