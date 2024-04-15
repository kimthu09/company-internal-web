import { SidebarItem } from "@/types";
import { HiOutlineHome } from "react-icons/hi2";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { CgWorkAlt } from "react-icons/cg";
export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: HiOutlineHome,
    submenu: false,
  },
  {
    title: "Bảng tin",
    href: "/news",
    icon: HiOutlineNewspaper,
    submenu: false,
  },
  {
    title: "Lịch",
    href: "/calendar",
    icon: HiOutlineCalendarDays,
    submenu: true,
    subMenuItems: [
      { title: "Lịch làm việc", href: "/calendar/jobs" },
      { title: "Lịch phòng họp", href: "/calendar/room" },
      { title: "Lịch tài nguyên", href: "/calendar/resources" },
    ],
  },
  {
    title: "Tài liệu",
    href: "/document",
    icon: HiOutlineDocumentText,
    submenu: false,
  },
  {
    title: "Quản lý",
    href: "/manage",
    icon: CgWorkAlt,
    submenu: true,
    subMenuItems: [
      { title: "Nhân viên", href: "/manage/employee" },
      { title: "Phòng ban", href: "/manage/department" },
      { title: "Tài nguyên", href: "/manage/resources" },
      { title: "Phòng họp", href: "/manage/room" },
    ],
  },
];
