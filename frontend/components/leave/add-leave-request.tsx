"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import createLeave from "@/lib/leave/createLeaveRequest";
import { stringToDate } from "@/lib/utils";
import DaypickerPopup from "../ui/daypicker-popup";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Input } from "../ui/input";
import { ShiftType } from "@/types";
import SelectShift from "../calendar/resources/select-shift";
const required = z.string().min(1, "Không để trống trường này");

const SupplierSchema = z.object({
  fromDate: required,
  toDate: required,

  fromShiftType: required,
  toShiftType: required,

  note: required,
});

const AddLeaveRequest = ({ onAdded }: { onAdded?: () => void }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      note: "",
    },
  });
  const { showLoading, hideLoading } = useLoading();
  const onSubmit: SubmitHandler<z.infer<typeof SupplierSchema>> = async (
    data
  ) => {
    setOpen(false);

    const response: Promise<any> = createLeave({
      data: data,
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
        description: "Tạo đơn xin nghỉ thành công",
      });
      if (onAdded) {
        onAdded();
      }
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        reset({
          fromDate: format(new Date(), "dd/MM/yyyy", {
            locale: vi,
          }),
          toDate: format(new Date(), "dd/MM/yyyy", {
            locale: vi,
          }),
          note: "",
          fromShiftType: ShiftType.DAY,
          toShiftType: ShiftType.NIGHT,
        });
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="link___primary hover:no-underline	text-base font-normal"
        >
          Tạo đơn xin nghỉ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[472px] p-0 bg-white">
        <DialogHeader>
          <DialogTitle className="p-6 pb-0"> Tạo đơn xin nghỉ</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-4 border-y-[1px]">
          <div className="flex flex-col">
            <label htmlFor="location" className="font-medium">
              Từ ngày
            </label>
            <div className="flex gap-4 items-end">
              <Controller
                control={control}
                name={`fromDate`}
                render={({ field }) => {
                  var dateObject = stringToDate(field.value);
                  return (
                    <DaypickerPopup
                      triggerClassname="rounded-md flex-1"
                      date={dateObject ?? new Date()}
                      setDate={(date) =>
                        field.onChange(
                          format(date!, "dd/MM/yyyy", {
                            locale: vi,
                          })
                        )
                      }
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name={`fromShiftType`}
                render={({ field }) => {
                  return (
                    <div className="text-gray-text">
                      <SelectShift
                        value={field.value}
                        setValue={(value) => field.onChange(value)}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="location" className="font-medium">
              Đến ngày
            </label>
            <div className="flex gap-4 items-end">
              <Controller
                control={control}
                name={`toDate`}
                render={({ field }) => {
                  var dateObject = stringToDate(field.value);
                  return (
                    <DaypickerPopup
                      triggerClassname="rounded-md flex-1"
                      date={dateObject ?? new Date()}
                      setDate={(date) =>
                        field.onChange(
                          format(date!, "dd/MM/yyyy", {
                            locale: vi,
                          })
                        )
                      }
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name={`toShiftType`}
                render={({ field }) => {
                  return (
                    <div className="text-gray-text">
                      <SelectShift
                        value={field.value}
                        setValue={(value) => field.onChange(value)}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="note" className="font-medium">
              Ghi chú <span className="error___message">*</span>
            </label>
            <Input id="note" {...register("note")}></Input>
            {errors.note && (
              <span className="error___message">{errors.note.message}</span>
            )}
          </div>
        </div>
        <div className="p-4 flex-1 flex justify-end">
          <div className="flex gap-4">
            <Button
              type="reset"
              variant={"outline"}
              onClick={() => setOpen(false)}
            >
              Huỷ
            </Button>

            <Button
              // disabled={!isDirty}
              type="button"
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveRequest;
