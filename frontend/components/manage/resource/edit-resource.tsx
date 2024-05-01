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
import { Resource } from "@/types";
import { useSWRConfig } from "swr";
import updateResource from "@/lib/resources/updateResource";
const required = z.string().min(1, "Không để trống trường này");

const SupplierSchema = z.object({
  name: required,
});

const EditResource = ({
  children,
  resource,
  onAdded,
}: {
  children: React.ReactNode;
  resource: Resource;
  onAdded?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
  });
  const { mutate } = useSWRConfig();

  const { showLoading, hideLoading } = useLoading();
  const onSubmit: SubmitHandler<z.infer<typeof SupplierSchema>> = async (
    data
  ) => {
    setOpen(false);

    const response: Promise<any> = updateResource({
      id: resource.id.toString(),
      name: data.name,
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
        description: "Thay đổi tên tài nguyên thành công",
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
        reset({ name: resource.name });
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[472px] p-0 bg-white">
        <DialogHeader>
          <DialogTitle className="p-6 pb-0">
            Chỉnh sửa tên phòng ban
          </DialogTitle>
        </DialogHeader>
        <form>
          <div className="p-6 flex flex-col gap-4 border-y-[1px]">
            <div>
              <label htmlFor="name" className="font-medium">
                Tên phòng ban
              </label>
              <Input id="name" {...register("name")}></Input>
              {errors.name && (
                <span className="error___message">{errors.name.message}</span>
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
                disabled={!isDirty}
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResource;
