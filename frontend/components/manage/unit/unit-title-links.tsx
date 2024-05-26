"use client";
import { Button } from "@/components/ui/button";
import { unitLinks } from "@/constants";
import { Unit } from "@/types";
import Link from "next/link";
import React from "react";
import { FaPen } from "react-icons/fa";
import EditUnitName from "./edit-unit-name";
import { useCurrentUser } from "@/hooks/use-user";
import { includesRoles } from "@/lib/utils";

const UnitTitleLinks = ({
  data,
  selectedPage,
}: {
  data: Unit;
  selectedPage: number;
}) => {
  const { currentUser } = useCurrentUser();
  const isAdminRole =
    currentUser &&
    includesRoles({
      currentUser: currentUser,
      roleCodes: ["ADMIN"],
    });
  return (
    <div className="pb-5 border-b w-full flex flex-row gap-5 items-end flex-wrap">
      <div className="flex items-center gap-1">
        <h1 className="table___title uppercase">{data.name}</h1>
        {isAdminRole && (
          <EditUnitName unit={data}>
            <Button variant={"ghost"} className="rounded-full p-0 w-8 h-8">
              <FaPen className="text-muted-foreground" />
            </Button>
          </EditUnitName>
        )}
      </div>

      {unitLinks.map((item, index) => (
        <Link
          key={item.value}
          className={`${
            selectedPage === index
              ? "text-blue-primary"
              : "text-muted-foreground"
          } hover:text-blue-primary transition-colors font-medium tracking-wide whitespace-nowrap`}
          href={`/manage/unit/${data.id}${item.href}`}
        >
          {item.label}
        </Link>
      ))}
      {selectedPage === 1 ? (
        <span className="whitespace-nowrap text-muted-foreground ml-auto">
          Tổng số nhân viên: {data.numberStaffs}
        </span>
      ) : null}
    </div>
  );
};

export default UnitTitleLinks;
