import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shiftTypeToString } from "@/lib/utils";
import { ShiftType } from "@/types";
import { PiSun } from "react-icons/pi";
import { PiSunHorizon } from "react-icons/pi";
type SelectShiftProps = {
  value: string;
  setValue: (value: string) => void;
};

const SelectShift = ({ value, setValue }: SelectShiftProps) => {
  return (
    <div className="flex gap-2">
      <div
        title={shiftTypeToString(ShiftType.DAY)}
        className={`p-1 ${
          value === ShiftType.DAY ? "bg-primary/20" : ""
        }  rounded-lg cursor-pointer hover:text-primary transition-colors`}
        onClick={() => setValue(ShiftType.DAY)}
      >
        <PiSun className="w-6 h-6" />
      </div>
      <div
        title={shiftTypeToString(ShiftType.NIGHT)}
        className={`p-1 ${
          value === ShiftType.NIGHT ? "bg-primary/20" : ""
        } rounded-lg cursor-pointer hover:text-primary transition-colors`}
        onClick={() => setValue(ShiftType.NIGHT)}
      >
        <PiSunHorizon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default SelectShift;
