"use client";

import Image from "next/image";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { LuChevronDown } from "react-icons/lu";
import { sidebarItems } from "@/constants";
import { SidebarItem } from "@/types";

export default function Sidebar() {
  const [isCollapse, toggleIsCollapse] = useState(false);

  const toggleSidebarHandler = () => {
    toggleIsCollapse((prev) => !prev);
  };

  const [items, setItems] = useState<SidebarItem[]>(sidebarItems);
  return (
    <div className="lg:flex hidden z-20">
      <aside
        className={`bg-[#fafdfd] h-screen p-1 transition-all shadow-md overflow-auto ${
          isCollapse ? "w-[5rem]" : "w-64"
        }`}
      >
        <nav className="w-full">
          <div className={`flex items-center my-4 h-[64px]`}>
            <Link href="/">
              <div
                className={`flex align-middle justify-center items-center gap-4 h-[64px] ml-2 rounded-xl ${
                  isCollapse ? "hidden" : "flex"
                }`}
              >
                <Image
                  className="h-[48px] w-auto"
                  src="/companion.png"
                  alt="logo"
                  width={300}
                  height={300}
                  priority
                ></Image>
              </div>
            </Link>
            <div
              className={`hover:text-primary cursor-pointer ${
                isCollapse ? "m-auto p-1" : "ml-auto mr-3 p-1 "
              }`}
              onClick={toggleSidebarHandler}
            >
              <RxHamburgerMenu className="w-6 h-6 " />
            </div>
          </div>

          <ul className="sidebar__list">
            {items.map((item) => (
              <li className="sidebar__item" key={item.title}>
                <MenuItem item={item} isCollapse={isCollapse}></MenuItem>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

const MenuItem = ({
  item,
  isCollapse,
}: {
  item: SidebarItem;
  isCollapse: boolean;
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div>
      {item.submenu ? (
        <>
          <div onClick={toggleSubMenu}>
            <div
              className={`flex items-center
             text-base no-underline text-black px-4 py-3 mb-2 rounded-md overflow-hidden max-h-15 hover:text-primary cursor-pointer `}
            >
              {item.icon ? (
                <>
                  <div className="p-2 rounded-md shadow-md flex justify-center items-center bg-white">
                    <span>
                      <item.icon
                        className={`sidebar__icon ${
                          (pathname.includes(item.href) && item.href !== "/") ||
                          pathname === item.href
                            ? "text-primary"
                            : "text-gray-text"
                        }`}
                      />
                    </span>
                  </div>
                </>
              ) : null}

              <span
                className={`ml-4 text-lg overflow-hidden  whitespace-nowrap ${
                  isCollapse ? "collapse opacity-0" : "visible opacity-100"
                }`}
              >
                {item.title}
              </span>
              <div
                className={`ml-auto self-center transition-all ${
                  isCollapse ? "hidden" : "visible"
                } ${subMenuOpen && !isCollapse ? "rotate-180" : ""} flex`}
              >
                <LuChevronDown className="w-5 h-5 inline-block text-black" />
              </div>
            </div>
          </div>

          <div
            className={` ml-12 flex flex-col space-y-4 transition-all duration-300  ${
              subMenuOpen && !isCollapse ? "max-h-80 my-2" : "max-h-0"
            }`}
          >
            {item.subMenuItems?.map((subItem, idx) => {
              return (
                <Link
                  key={idx}
                  href={subItem.href}
                  className={`flex text-base no-underline text-gray-text rounded-md overflow-hidden  hover:text-primary transition-colors`}
                >
                  {subItem.icon ? (
                    <>
                      <span>
                        <subItem.icon className="sidebar__icon" />
                      </span>
                    </>
                  ) : null}

                  <span
                    className={`ml-4 text-lg overflow-hidden   whitespace-nowrap ${
                      isCollapse ? "hidden" : "visible"
                    } ${
                      pathname.includes(subItem.href)
                        ? "text-primary font-medium"
                        : ""
                    }`}
                  >
                    {subItem.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <Link
          href={item.href}
          className={`flex items-center text-base no-underline text-black px-4 py-3 mb-2 rounded-md overflow-hidden max-h-15 hover:text-primary transition-colors`}
        >
          {item.icon && (
            <>
              <div className="p-2 rounded-md shadow-md flex justify-center items-center bg-white">
                <span>
                  <item.icon
                    className={`sidebar__icon ${
                      (pathname.includes(item.href) && item.href !== "/") ||
                      pathname === item.href
                        ? "text-primary"
                        : "text-gray-text"
                    }`}
                  />
                </span>
              </div>
            </>
          )}

          <span
            className={`ml-4 text-lg overflow-hidden  whitespace-nowrap ${
              isCollapse ? "collapse" : "visible"
            }`}
          >
            {item.title}
          </span>
        </Link>
      )}
    </div>
  );
};
