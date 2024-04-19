import React from "react";

const UnitDetail = ({ params }: { params: { unitId: string } }) => {
  return <div>UnitDetail {params.unitId}</div>;
};

export default UnitDetail;
