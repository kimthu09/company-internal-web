"use client";
import { Employee } from "@/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import updateUnit from "@/lib/unit/updateUnit";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import { useSWRConfig } from "swr";
import { endpoint } from "@/constants";
import EmployeeListUnit from "../employee/employee-list-unit";

const ChangeManager = ({ unitId }: { unitId: string }) => {
  const { showLoading, hideLoading } = useLoading();
  const { mutate } = useSWRConfig();

  const [value, setValue] = useState<Employee>();
  const onValueChange = (value: Employee) => {
    setValue(value);
  };
  const [open, setOpen] = useState(false);
  const onOpenChange = (value: boolean) => {
    if (value) {
      setValue(undefined);
    }
    setOpen(value);
  };
  const onSubmit = async () => {
    onOpenChange(false);

    showLoading();
    const response: Promise<any> = updateUnit({
      id: unitId,
      managerId: value?.id,
    });
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
        description: "Thay đổi trưởng phòng thành công",
      });
      mutate(`${endpoint}/unit/${unitId}`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="font-semibold tracking-widest rounded-full hover:bg-hover-accent">
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Đổi trưởng phòng</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-7 pb-56">
          {value ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm uppercase">Trưởng phòng mới: </h3>
              <div className="flex items-center gap-2 w-full text-sm">
                <span className="font-semibold flex-1">
                  {value.name}
                  <span className="font-normal">({value.email})</span>
                </span>

                <span className="font-medium text-hover-accent text-right">
                  {value.phone}
                </span>
              </div>
            </div>
          ) : null}
          <EmployeeListUnit
            value={value}
            onValueChange={onValueChange}
            unitId={unitId}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <div className="flex gap-5 sm:justify-end justify-stretch">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              className="sm:flex flex-1 w-auto"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={() => onSubmit()}
              className="sm:flex flex-1 whitespace-nowrap"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeManager;
