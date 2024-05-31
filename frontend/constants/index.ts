import { SidebarItem, UnitLink } from "@/types";
import { FiHome } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { SlDocs } from "react-icons/sl";
import { CgWorkAlt } from "react-icons/cg";
import { z } from "zod";
export const endpoint = "https://ciw-be.onrender.com/api/v1";
export const required = z.string().min(1, "Không để trống trường này");
export const phoneRegex = new RegExp(/(0[3|5|7|8|9])+([0-9]{8})\b/g);
export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
    submenu: false,
  },
  {
    title: "Bảng tin",
    href: "/news",
    icon: IoNewspaperOutline,
    submenu: false,
  },
  {
    title: "Lịch",
    href: "/calendar",
    icon: IoCalendarOutline,
    submenu: true,
    subMenuItems: [
      { title: "Lịch phòng họp", href: "/calendar/room" },
      { title: "Lịch tài nguyên", href: "/calendar/resources" },
    ],
  },
];
export const managerSidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
    submenu: false,
  },
  {
    title: "Bảng tin",
    href: "/news",
    icon: IoNewspaperOutline,
    submenu: false,
  },
  {
    title: "Lịch",
    href: "/calendar",
    icon: IoCalendarOutline,
    submenu: true,
    subMenuItems: [
      { title: "Lịch phòng họp", href: "/calendar/room" },
      { title: "Lịch tài nguyên", href: "/calendar/resources" },
    ],
  },
  {
    title: "Duyệt đơn",
    href: "/confirm-request",
    icon: SlDocs,
    submenu: false,
  },
];
export const adminSidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: FiHome,
    submenu: false,
  },
  {
    title: "Bảng tin",
    href: "/news",
    icon: IoNewspaperOutline,
    submenu: false,
  },
  {
    title: "Lịch",
    href: "/calendar",
    icon: IoCalendarOutline,
    submenu: true,
    subMenuItems: [
      { title: "Lịch phòng họp", href: "/calendar/room" },
      { title: "Lịch tài nguyên", href: "/calendar/resources" },
    ],
  },
  {
    title: "Duyệt đơn",
    href: "/confirm-request",
    icon: SlDocs,
    submenu: false,
  },
  {
    title: "Quản lý",
    href: "/manage",
    icon: CgWorkAlt,
    submenu: true,
    subMenuItems: [
      { title: "Nhân viên", href: "/manage/employee" },
      { title: "Phòng ban", href: "/manage/unit" },
      { title: "Tài nguyên", href: "/manage/resources" },
      { title: "Phòng họp", href: "/manage/room" },
    ],
  },
];

export const unitLinks: UnitLink[] = [
  {
    value: "info",
    label: "Thông tin",
    href: "",
  },
  {
    value: "employee",
    label: "Nhân viên",
    href: "/employee",
  },
];

export const calendarLinks: UnitLink[] = [
  {
    value: "general",
    label: "Lịch chung",
    href: "",
  },
  {
    value: "personal",
    label: "Lịch đã đăng ký",
    href: "/personal",
  },
];
