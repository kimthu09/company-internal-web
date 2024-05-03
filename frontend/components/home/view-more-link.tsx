import Link from "next/link";
import React from "react";
import { GoArrowRight } from "react-icons/go";

const ViewMoreLink = ({ href }: { href: string }) => {
  return (
    <Link
      href={href}
      className="uppercase text-xs font-bold hover:text-primary transition-colors tracking-wider mt-5 flex flex-row items-center gap-2"
    >
      Xem thêm
      <GoArrowRight className="h-4 w-4" />
    </Link>
  );
};

export default ViewMoreLink;
