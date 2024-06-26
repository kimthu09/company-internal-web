import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import deleteBookedResource from "@/lib/resources/deleteBookedResource";
import { shiftTypeToString, stringToDate } from "@/lib/utils";
import { ShiftType } from "@/types";
import { FaTrash } from "react-icons/fa";
import { PiSun, PiSunHorizon } from "react-icons/pi";

export type BookingProps = {
  id: number;
  resource: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    email: string;
    phone: string;
    name: string;
    image: string;
  };
};

const BookingItemList = ({
  prop,
  dayArray,
  nightArray,
  isPersonal,
  onDeleted,
  isAdmin,
}: {
  prop: string;
  dayArray: BookingProps[];
  nightArray: BookingProps[];
  isPersonal?: boolean;
  onDeleted?: () => void;
  isAdmin?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-5 pb-7">
      <h2 className="text_line font-medium">
        <span>{prop}</span>
      </h2>
      {dayArray.length > 0 ? (
        <div className="flex gap-5">
          <div className="uppercase font-light w-20 flex gap-1 self-start items-center">
            <PiSun className="w-6 h-6 text-amber-500 " />
            {shiftTypeToString(ShiftType.DAY)}
          </div>
          <div className="flex flex-col flex-1 gap-5">
            {dayArray.map((item) => (
              <BookingItem
                onDeleted={onDeleted}
                canDelete={stringToDate(prop)! > new Date()}
                key={item.id}
                booking={item}
                isPersonal={isPersonal}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      ) : null}

      {nightArray.length > 0 ? (
        <div className="flex gap-5">
          <div className="uppercase font-light w-20 flex gap-1 self-start items-center">
            <PiSunHorizon className="w-6 h-6 text-orange-500" />
            {shiftTypeToString(ShiftType.NIGHT)}
          </div>
          <div className="flex flex-col flex-1 gap-5">
            {nightArray.map((item) => (
              <BookingItem
                onDeleted={onDeleted}
                canDelete={stringToDate(prop)! > new Date()}
                key={item.id}
                booking={item}
                isPersonal={isPersonal}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const BookingItem = ({
  booking,
  isPersonal,
  canDelete,
  onDeleted,
  isAdmin,
}: {
  booking: BookingProps;
  isPersonal?: boolean;
  canDelete?: boolean;
  onDeleted?: () => void;
  isAdmin?: boolean;
}) => {
  const { showLoading, hideLoading } = useLoading();
  const onDelete = async ({ id }: { id: number }) => {
    const response: Promise<any> = deleteBookedResource({
      id: id.toString(),
    });
    showLoading();
    const responseData = await response;
    hideLoading();
    if (
      responseData.hasOwnProperty("response") &&
      responseData.response.hasOwnProperty("data") &&
      responseData.response.data.hasOwnProperty("message") &&
      responseData.response.data.hasOwnProperty("status")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.response.data.message,
      });
    } else if (
      responseData.hasOwnProperty("code") &&
      responseData.code.includes("ERR")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Thành công",
        description: "Huỷ đặt dùng tài nguyên thành công",
      });
      if (onDeleted) {
        onDeleted();
      }
    }
  };
  return (
    <div className="flex">
      <span className="text-primary mr-auto">{booking.resource.name}</span>

      <div className="flex gap-4 items-start w-2/5">
        <Avatar className="h-8 w-8">
          <AvatarImage src={booking.createdBy.image} alt="avatar" />
          <AvatarFallback>
            {booking.createdBy.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="leading-4">
          <h3 className="text-black text-sm">{booking.createdBy.name}</h3>
          <span className="text-muted-foreground text-[0.8rem]">
            {booking.createdBy.phone}
          </span>
        </div>
      </div>
      {isPersonal || isAdmin ? (
        <ConfirmDialog
          title={"Xác nhận"}
          description="Bạn xác nhận muốn huỷ việc đặt dùng tài nguyên ?"
          handleYes={() => {
            onDelete({ id: booking.id });
          }}
        >
          <Button
            title="Xoá lịch đã đặt"
            size={"icon"}
            variant={"ghost"}
            className={`rounded-full  text-rose-500 hover:text-rose-600 ${
              canDelete ? "visible" : "collapse"
            }`}
          >
            <FaTrash />
          </Button>
        </ConfirmDialog>
      ) : null}
    </div>
  );
};
export default BookingItemList;
