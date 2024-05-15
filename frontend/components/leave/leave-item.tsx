import { LeaveRequest } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dateTimeStringFormat, shiftTypeToString } from "@/lib/utils";

const LeaveItem = ({
  item,
  className,
}: {
  item: LeaveRequest;
  className?: string;
}) => {
  return (
    <div className={` flex flex-row gap-3 ${className ?? ""}`}>
      <Avatar>
        <AvatarImage src={item.createdBy.image} alt="avatar" />
        <AvatarFallback>{item.createdBy.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex text-sm items-center flex-1 gap-2 text-gray-text">
          <span className="font-medium text-black text-base">
            {item.createdBy.name}
          </span>

          <span>{dateTimeStringFormat(item.createdAt)}</span>
        </div>
        <span className="font-medium">
          Thời gian nghỉ: Từ {shiftTypeToString(item.fromShiftType)} ngày{" "}
          {item.fromDate} đến {shiftTypeToString(item.toShiftType)} ngày{" "}
          {item.toDate}
        </span>
        <span className="font-light ">{item.note}</span>
        <div className="flex gap-1 items-center text-sm text-gray-text">
          <span
            className={`rounded-full px-3 py-[0.4rem]  outline-none text-xs  text-white whitespace-nowrap uppercase ${
              item.approvedBy
                ? "bg-green-primary/90"
                : item.acceptedBy
                ? "bg-blue-primary/80"
                : item.rejectedBy
                ? "bg-rose-400"
                : "bg-primary"
            }`}
          >
            {item.approvedBy
              ? "Đã duyệt"
              : item.acceptedBy
              ? "Đã xác nhận"
              : item.rejectedBy
              ? "Đã từ chối"
              : "Chưa xác nhận"}
          </span>
          {item.approvedBy ? (
            <>
              bởi
              <span className="font-medium text-black">
                {item.approvedBy.name}
              </span>
              lúc
              <span>{dateTimeStringFormat(item.approvedAt!)}</span>
            </>
          ) : item.acceptedBy ? (
            <>
              bởi
              <span className="font-medium text-black">
                {item.acceptedBy.name}
              </span>
              lúc
              <span>{dateTimeStringFormat(item.acceptedAt!)}</span>
            </>
          ) : item.rejectedBy ? (
            <>
              bởi
              <span className="font-medium text-black">
                {item.rejectedBy.name}
              </span>
              lúc
              <span>{dateTimeStringFormat(item.rejectedAt!)}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LeaveItem;
