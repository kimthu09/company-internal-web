"use client";
import DropdownSkeleton from "@/components/skeleton/dropdown-skeleton";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import getAllUnits from "@/lib/unit/getAllUnits";
import { cn } from "@/lib/utils";
import { Unit } from "@/types";
import React, { useEffect, useState } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

export interface UnitListProps {
  unit: string | number;
  setUnit: (unit: string | number) => void;
  isId: boolean;
}
const UnitList = ({ isId, unit, setUnit }: UnitListProps) => {
  const [open, setOpen] = useState(false);
  const { units, isLoading, isError } = getAllUnits({
    filter: { limit: "1000", page: "1" },
  });
  const [unitList, setUnitList] = useState<Array<Unit>>([]);
  useEffect(() => {
    if (units) {
      setUnitList(units.data);
    }
  }, [units]);
  if (isError) return <div>Failed to load</div>;
  if (!units) {
    <div>Loading</div>;
    return <DropdownSkeleton />;
  } else {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full min-w-0 h-10 rounded-full"
          >
            {unit && unit !== -1
              ? unitList.find(
                  (item) =>
                    (isId && item.id === unit) || (!isId && item.name === unit)
                )?.name
              : "Chọn phòng ban"}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="PopoverContent rounded-xl w-full">
          <Command className="w-full">
            <CommandList>
              <CommandGroup>
                {unitList.map((item) => (
                  <CommandItem
                    value={item.name}
                    key={item.id}
                    onSelect={() => {
                      if (isId) {
                        setUnit(item.id);
                      } else {
                        setUnit(item.name);
                      }
                      setOpen(false);
                    }}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        isId
                          ? item.id === unit
                            ? "opacity-100"
                            : "opacity-0"
                          : item.name === unit
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
};

export default UnitList;
