"use client";

import Link from "next/link";
import Image from "next/image";
import { GoBell } from "react-icons/go";
import { logOut } from "@/lib/auth/action";
// import { Button } from "./ui/button";
import { LuLogOut } from "react-icons/lu";
import { Button } from "./ui/button";
import getUnseenNumber from "@/lib/notification/getUnseenNumber";
// import Profile from "./profile";

const Header = () => {
  const { data, mutate, isLoading, isError } = getUnseenNumber();
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
        <div className="self-center flex items-center">
          <Link
            href={"/notifications"}
            className="hover:text-primary transition-colors"
          >
            <div className="relative">
              <GoBell className="w-6 h-6 " />
              {data && (
                <div className="absolute top-[-5px] right-[-2px] rounded-full bg-primary h-4 w-4 flex leading-3 justify-center items-center text-xs font-bold text-accent">
                  {data.number}
                </div>
              )}
            </div>
          </Link>

          {/* <Profile /> */}
          <form action={logOut} className="w-full">
            <Button
              variant={"ghost"}
              className="rounded-none w-full justify-start"
            >
              <div className="flex gap-2 text-primary">
                <LuLogOut className="h-5 w-5 " />
                Đăng xuất
              </div>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;
