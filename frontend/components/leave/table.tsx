"use client";
import React from "react";
import AddLeaveRequest from "./add-leave-request";
import { useSearchParams } from "next/navigation";
import { LeaveRequest } from "@/types";
import LeaveItem from "./leave-item";
import ViewMoreLink from "../home/view-more-link";
import NotiListSkeleton from "../notification/noti-list-skeleton";
import ConfirmDialog from "../ui/confirm-dialog";
import { Button } from "../ui/button";
import { FaTrash } from "react-icons/fa";
import { useLoading } from "@/hooks/loading-context";
import { toast } from "../ui/use-toast";
import deleteLeaveRequest from "@/lib/leave/deleteLeaveRequest";
import getPersonalLeaveRequest from "@/lib/leave/getPersonalRequestForLeave";

const LeaveTable = () => {
  const searchParams = useSearchParams();

  const limit = searchParams.get("limit") ?? "10";
  const { requests, mutate, isLoading, isError } = getPersonalLeaveRequest({
    // encodedString: filterString,
    filter: {
      page: "1",
      limit: limit,
    },
  });
  const { showLoading, hideLoading } = useLoading();
  const onDelete = async ({ id }: { id: number }) => {
    const response: Promise<any> = deleteLeaveRequest({
      id: id.toString(),
    });
    showLoading();
    const responseData = await response;
    hideLoading();
    if (
      responseData.hasOwnProperty("response") &&
      responseData.response.hasOwnProperty("data") &&
      responseData.response.data.hasOwnProperty("message") &&
      responseData.response.data.hasOwnProperty("status")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.response.data.message,
      });
    } else if (
      responseData.hasOwnProperty("code") &&
      responseData.code.includes("ERR")
    ) {
      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: responseData.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Thành công",
        description: "Xoá đơn nghỉ phép thành công",
      });
    }
  };
  if (isLoading) {
    return <NotiListSkeleton number={5} />;
  } else if (isError || requests.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div>
        <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
          <h1 className="table___title">Đơn nghỉ phép</h1>
          <AddLeaveRequest onAdded={() => mutate()} />
        </div>
        <div className="w-full flex flex-col">
          {requests.data.length > 0 ? (
            requests.data.map((item: LeaveRequest) => (
              <div
                key={item.id}
                className="flex border-b border-b-border py-4 my-2 "
              >
                <LeaveItem className="flex-1" item={item} />
                {item.approvedBy || item.rejectedBy ? null : (
                  <ConfirmDialog
                    title={"Xác nhận"}
                    description="Bạn xác nhận muốn huỷ đơn xin nghỉ phép này?"
                    handleYes={() => {
                      onDelete({ id: item.id });
                    }}
                  >
                    <Button
                      title="Xoá đơn xin nghỉ phép"
                      size={"icon"}
                      variant={"ghost"}
                      className={`rounded-full  text-rose-500 hover:text-rose-600 text `}
                    >
                      <FaTrash />
                    </Button>
                  </ConfirmDialog>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center py-20">
              Không tìm thấy kết quả.
            </div>
          )}
          {requests.paging.limit < requests.paging.totalElements ? (
            <div className="flex items-center justify-end space-x-2 py-4">
              <ViewMoreLink href={`/leave?limit=${+limit + 10}`} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
};

export default LeaveTable;
