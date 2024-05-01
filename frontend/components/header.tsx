"use client";

import Link from "next/link";
import Image from "next/image";
// import { logOut } from "@/lib/auth/action";
// import { Button } from "./ui/button";
// import { LuLogOut } from "react-icons/lu";
// import Profile from "./profile";

const Header = () => {
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
        <div className="self-center flex">{/* <Profile /> */}</div>
      </div>
    </div>
  );
};

export default Header;
