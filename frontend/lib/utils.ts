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

export const stringToDate = (value: string) => {
  try {
    var dateParts = value.split("/");
    var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    return dateObject;
  } catch (error) {
    // Handle the error here
    console.error("Error converting string to date:", error);
    return null; // Or any default value you prefer
  }
};
