import { ShiftType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const shiftTypeToString = (value: ShiftType | string) => {
  if (value === ShiftType.DAY) {
    return "Sáng";
  } else {
    return "Chiều";
  }
};
