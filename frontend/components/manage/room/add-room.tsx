"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import createRoom from "@/lib/room/createRoom";
const required = z.string().min(1, "Không để trống trường này");

const SupplierSchema = z.object({
  name: required,
  location: z.string(),
});

const AddRoom = ({ onAdded }: { onAdded?: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
  });
  const { showLoading, hideLoading } = useLoading();
  const onSubmit: SubmitHandler<z.infer<typeof SupplierSchema>> = async (
    data
  ) => {
    setOpen(false);

    const response: Promise<any> = createRoom({
      name: data.name,
      location: data.location,
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
        description: "Thêm phòng họp thành công",
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
        reset({ name: "" });
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="link___primary hover:no-underline	text-base font-normal"
        >
          Thêm phòng họp
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[472px] p-0 bg-white">
        <DialogHeader>
          <DialogTitle className="p-6 pb-0">Thêm phòng họp</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-4 border-y-[1px]">
          <div>
            <label htmlFor="name" className="font-medium">
              Tên phòng họp <span className="error___message">*</span>
            </label>
            <Input id="name" {...register("name")}></Input>
            {errors.name && (
              <span className="error___message">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="location" className="font-medium">
              Vị trí
            </label>
            <Input id="location" {...register("location")}></Input>
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
              disabled={!isDirty}
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

export default AddRoom;
