"use client";

import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect,
} from "react";

import { cn } from "@/lib/utils";
import { Employee } from "@/types";

type AutoCompleteProps = {
  options: Employee[];
  emptyMessage: string;
  value?: Employee;
  onValueChange?: (value: Employee) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputValue: string;
  setInputValue: (value: string) => void;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  inputValue,
  setInputValue,
}: AutoCompleteProps) => {
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Employee>(value as Employee);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.name === input.value
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue("");
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Employee) => {
      // setInputValue(selectedOption.name);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );
  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);
    inputRef.current?.focus();
  }, []);
  const detectKeyDown = (e: any) => {
    if (e.key === "F2") {
      inputRef.current?.focus();
      setInputValue("");
    }
    return () => {
      document.removeEventListener("keydown", detectKeyDown);
    };
  };
  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base"
        />
      </div>
      <div className="mt-1 relative">
        <div className="absolute top-0 z-10 w-full rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
          <CommandList className="border bg-white rounded-lg">
            {isLoading || !options ? (
              <CommandPrimitive.Loading>
                <div className="flex justify-center items-center">Loading</div>
              </CommandPrimitive.Loading>
            ) : null}
            {options.length > 0 && !isLoading ? (
              <CommandGroup className="max-h-56 overflow-y-auto">
                {options.map((option) => {
                  const isSelected = selected?.name === option.name;
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.name.toString()}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn("flex items-center gap-2 w-full pl-2")}
                    >
                      <div className="flex justify-between flex-1">
                        <span className="font-semibold flex-1">
                          {option.name}{" "}
                          <span className="font-normal">({option.email})</span>
                        </span>
                        <div className="basis-1/3 flex justify-end">
                          <span className="font-medium text-hover-accent">
                            {option.phone}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading || options.length < 1 ? (
              <CommandPrimitive.Empty className="select-none h-24 rounded-sm px-2 py-6 text-sm text-center">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
