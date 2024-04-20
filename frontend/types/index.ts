import { IconType } from "react-icons";

export type SidebarItem = {
  title: string;
  href: string;
  icon?: IconType;
  submenu?: boolean;
  subMenuItems?: SidebarItem[];
};
export type Unit = {
  id: number;
  name: string;
  numberStaffs: number;
  manager: {
    id: number;
    email: string;
    phone: string;
    name: string;
    image: string;
  };
  staffs: {
    id: number;
    email: string;
    phone: string;
    name: string;
    image: string;
  }[];
  features: {
    id: number;
    name: string;
    has: boolean;
  }[];
};
export type Employee = {
  id: number;
  name: string;
  image: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  male: boolean;
  unit: {
    id: number;
    name: string;
  };
};
export type Feature = {
  id: number;
  name: string;
};
