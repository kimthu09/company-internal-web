"use client";

import Link from "next/link";
import Image from "next/image";
import { GoBell } from "react-icons/go";
import getUnseenNumber from "@/lib/notification/getUnseenNumber";
import Profile from "./home/profile";
import { FaRegBuilding } from "react-icons/fa";
import getProfile from "@/lib/profile/getProfile";
import { includesRoles } from "@/lib/utils";
import { FaRegFileAlt } from "react-icons/fa";
const Header = () => {
  const { data, mutate, isLoading, isError } = getUnseenNumber();
  const {
    data: user,
    mutate: mutateUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = getProfile();
  const canView =
    user && !includesRoles({ currentUser: user, roleCodes: ["ADMIN"] });
  return (
    <div className="flex z-10 bg-white w-[100%] border-b border-gray-200 px-4 pl-12">
      <div className="flex flex-1 h-[56px] items-center justify-between">
        <div className="flex items-center space-x-4 justify-between">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center lg:hidden"
          >
            <Image
              className="h-[32px] w-auto"
              src="/companion.png"
              alt="logo"
              width={300}
              height={300}
              priority
            ></Image>
          </Link>
        </div>
        <div className="self-center flex items-center gap-4">
          {canView && (
            <Link
              href={`/manage/unit/${user.unit.id}`}
              title="Phòng ban của bạn"
              className="hover:text-primary transition-colors"
            >
              <div className="relative">
                <FaRegBuilding className="w-6 h-6 " />
              </div>
            </Link>
          )}
          {canView && (
            <Link
              href={`/leave`}
              title="Đơn nghỉ phép của bạn"
              className="hover:text-primary transition-colors"
            >
              <div className="relative">
                <FaRegFileAlt className="w-6 h-6 " />
              </div>
            </Link>
          )}
          <Link
            title="Thông báo"
            href={"/notifications"}
            className="hover:text-primary transition-colors"
          >
            <div className="relative">
              <GoBell className="w-6 h-6 " />
              {data && data.number != 0 && (
                <div className="absolute top-[-5px] right-[-2px] rounded-full bg-primary h-4 w-4 flex leading-3 justify-center items-center text-xs font-bold text-accent">
                  {data.number}
                </div>
              )}
            </div>
          </Link>

          <Profile user={user} />
        </div>
      </div>
    </div>
  );
};

export default Header;
