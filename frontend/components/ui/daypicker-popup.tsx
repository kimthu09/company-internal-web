import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type DaypickerProps = {
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  placeholder?: string;
  triggerClassname?: string;
};
const DaypickerPopup = ({
  date,
  setDate,
  placeholder,
  fromDate,
  toDate,
  triggerClassname,
}: DaypickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `w-[280px] justify-start h-10 text-left font-normal rounded-xl ${triggerClassname}`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd/MM/yyyy", {
              locale: vi,
            })
          ) : (
            <span>{placeholder ?? "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          classNames={{
            head_cell:
              "text-muted-foreground rounded-md w-10 font-normal text-[1rem]",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
            ),
          }}
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DaypickerPopup;
