import { Employee, ShiftType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
export const includesRoles = ({
  currentUser,
  roleCodes,
}: {
  currentUser:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | undefined
    | Employee;
  roleCodes: string[];
}) => {
  try {
    const json = JSON.stringify(currentUser);
    const user = JSON.parse(json);
    const features = user.unit.features.map((item: any) => item.code);
    if (currentUser && roleCodes.every((item) => features.includes(item))) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Có lỗi xảy ra");
  }
};
export const includesOneRoles = ({
  currentUser,
  roleCodes,
}: {
  currentUser:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | undefined
    | Employee;
  roleCodes: string[];
}) => {
  try {
    const json = JSON.stringify(currentUser);
    const user = JSON.parse(json);
    const features = user.unit.features.map((item: any) => item.code);
    const set1 = new Set(features);
    if (currentUser && roleCodes.some((item) => set1.has(item))) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Có lỗi xảy ra");
  }
};
export const isManager = ({
  currentUser,
}: {
  currentUser:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | undefined;
}) => {
  try {
    if (currentUser) {
      const json = JSON.stringify(currentUser);
      const user = JSON.parse(json);
      if (
        user.unit.managerId &&
        user.id.toString() === user.unit.managerId.toString()
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  } catch (error) {
    throw new Error("Có lỗi xảy ra");
  }
};
export const isViewUnit = ({
  currentUser,
  unitId,
}: {
  currentUser:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | undefined;
  unitId: string;
}) => {
  try {
    if (currentUser) {
      const json = JSON.stringify(currentUser);
      const user = JSON.parse(json);
      if (user.unit.id.toString() === unitId) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  } catch (error) {
    throw new Error("Có lỗi xảy ra");
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
export const dateTimeStringFormat = (value: string) => {
  const dateObject = new Date(value);
  const formattedDate = format(dateObject, "HH:mm, dd/MM/yyyy", { locale: vi });
  return formattedDate;
};
