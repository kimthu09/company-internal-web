import React, { useCallback, useEffect, useRef, useState } from "react";
import { AutoComplete } from "./autocomplete";
import getAllEmployees, { fetcher } from "@/lib/employee/getAllEmployees";
import { Employee } from "@/types";

export type EmployeeListProps = {
  value?: Employee;
  onValueChange?: (value: Employee) => void;
  unitId: string;
};

const EmployeeListUnit = ({ value, onValueChange, unitId }: EmployeeListProps) => {
  const handleOnValueChange = (item: Employee) => { };
  const [inputValue, setInputValue] = useState<string>(value?.name || "");
  const [filterString, setFilterString] = useState("");
  const { employees, mutate, isLoading, isError } = getAllEmployees({
    encodedString: filterString,
    filter: {
      page: "1",
      limit: "15",
      unitId: unitId
    },
  });
  const searchHandler = useCallback(() => {
    const encodeValue = `name=${encodeURIComponent(inputValue.trim())}`;
    if (filterString !== encodeValue) {
      setFilterString(encodeValue);
    }
  }, [inputValue]);
  // EFFECT: Search Handler
  useEffect(() => {
    // Debounce search handler
    const timer = setTimeout(() => {
      searchHandler();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [searchHandler]);

  // if (isLoading) {
  //   return <DropdownSkeleton />;
  // } else
  return (
    <AutoComplete
      isLoading={isLoading}
      inputValue={inputValue}
      setInputValue={setInputValue}
      options={employees ? employees.data : []}
      emptyMessage="Không có nhân viên khớp với từ khóa"
      placeholder="Tìm tên nhân viên"
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default EmployeeListUnit;
