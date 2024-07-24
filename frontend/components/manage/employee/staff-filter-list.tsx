"use client";
import DropdownSkeleton from "@/components/skeleton/dropdown-skeleton";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import getAllEmployees from "@/lib/employee/getAllEmployees";
import getNotAdminAndNotDeletedEmployees from "@/lib/employee/getNotAdminAndNotDeletedEmployees";
import { cn } from "@/lib/utils";
import { Employee } from "@/types";
import React, { useEffect, useState } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

export interface StaffListProps {
  staff: string | number;
  setStaff: (staff: string | number, name?: string) => void;
  isId: boolean;
  readonly?: boolean;
  isForActiveAndNotAdmin?: boolean;
}
const StaffList = ({
  isId,
  staff,
  setStaff,
  readonly,
  isForActiveAndNotAdmin,
}: StaffListProps) => {
  const [open, setOpen] = useState(false);
  const { employees, isLoading, isError } = isForActiveAndNotAdmin
    ? getNotAdminAndNotDeletedEmployees({
        filter: {
          page: "1",
          limit: "10000",
        },
      })
    : getAllEmployees({
        filter: {
          page: "1",
          limit: "10000",
        },
      });
  const [resourceList, setResourceList] = useState<Array<Employee>>([]);
  useEffect(() => {
    if (employees) {
      setResourceList(employees.data);
    }
  }, [employees]);
  if (isError) return <div>Failed to load</div>;
  if (!employees) {
    return <DropdownSkeleton />;
  } else {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={readonly}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full min-w-0 h-10 rounded-full"
          >
            {staff && staff !== -1
              ? resourceList.find(
                  (item) =>
                    (isId && item.id.toString() === staff.toString()) ||
                    (!isId && item.name === staff)
                )?.name
              : "Chọn nhân viên"}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="PopoverContent rounded-xl w-full">
          <Command className="w-full">
            <CommandInput placeholder="Tìm tên nhân viên" />
            <CommandEmpty className="py-2 px-6">
              <div className="text-sm">Không tìm thấy kết quả</div>
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {resourceList.map((item) => (
                  <CommandItem
                    value={item.name}
                    key={item.id}
                    onSelect={() => {
                      if (isId) {
                        setStaff(item.id, item.name);
                      } else {
                        setStaff(item.name, item.name);
                      }

                      setOpen(false);
                    }}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        isId
                          ? item.id.toString() === staff.toString()
                            ? "opacity-100"
                            : "opacity-0"
                          : item.name === staff
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

export default StaffList;
