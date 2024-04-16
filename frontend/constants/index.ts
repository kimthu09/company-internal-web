import { SidebarItem } from "@/types";
import { FiHome } from "react-icons/fi";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { SlDocs } from "react-icons/sl";
import { CgWorkAlt } from "react-icons/cg";
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
      { title: "Lịch làm việc", href: "/calendar/jobs" },
      { title: "Lịch phòng họp", href: "/calendar/room" },
      { title: "Lịch tài nguyên", href: "/calendar/resources" },
    ],
  },
  {
    title: "Tài liệu",
    href: "/document",
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
      { title: "Phòng ban", href: "/manage/department" },
      { title: "Tài nguyên", href: "/manage/resources" },
      { title: "Phòng họp", href: "/manage/room" },
    ],
  },
];
