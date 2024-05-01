import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shiftTypeToString } from "@/lib/utils";
import { ShiftType } from "@/types";
import { PiSun, PiSunHorizon } from "react-icons/pi";

type BookingProps = {
  id: string;
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

const BookingItem = ({
  prop,
  dayArray,
  nightArray,
}: {
  prop: string;
  dayArray: BookingProps[];
  nightArray: BookingProps[];
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
              <div key={item.id} className="flex justify-between">
                <span className="text-primary">{item.resource.name}</span>

                <div className="flex gap-4 items-start w-2/5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.createdBy.image} alt="avatar" />
                    <AvatarFallback>
                      {item.createdBy.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-4">
                    <h3 className="text-black text-sm">
                      {item.createdBy.name}
                    </h3>
                    <span className="text-muted-foreground text-[0.8rem]">
                      {item.createdBy.phone}
                    </span>
                  </div>
                </div>
              </div>
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
              <div key={item.id} className="flex justify-between">
                <span className="text-primary">{item.resource.name}</span>

                <div className="flex gap-4 items-start w-2/5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.createdBy.image} alt="avatar" />
                    <AvatarFallback>
                      {item.createdBy.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-4">
                    <h3 className="text-black text-sm">
                      {item.createdBy.name}
                    </h3>
                    <span className="text-muted-foreground text-[0.8rem]">
                      {item.createdBy.phone}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookingItem;
