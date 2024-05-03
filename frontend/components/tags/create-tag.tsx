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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import createTag from "@/lib/tag/createTag";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/loading-context";

const TagSchema = z.object({
  name: z.string().min(1, "Tối thiểu 1 ký tự").max(50, "Tối đa 50 ký tự"),
});

const CreateDialog = ({
  children,
  handleTagAdded,
}: {
  children: React.ReactNode;
  handleTagAdded?: (tagId: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof TagSchema>>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const onSubmit: SubmitHandler<z.infer<typeof TagSchema>> = async (
    data
  ) => {
    const response: Promise<any> = createTag(data);
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
        description: "Thêm tag thành công",
      });
      setOpen(false);
      if (handleTagAdded) {
        handleTagAdded(responseData.id);
      }
      router.refresh();
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          reset({
            name: "",
          });
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="xl:max-w-[720px] max-w-[472px] p-0 bg-white">
        <DialogHeader>
          <DialogTitle className="p-6 pb-0">Thêm tag</DialogTitle>
        </DialogHeader>
        <form>
          <div className="p-6 flex flex-col gap-4 border-y-[1px]">
            <div>
              <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="name">
                Tên tag <span className="error___message">*</span>
              </label>
              <Input id="name" {...register("name")}></Input>
              {errors.name && (
                <span className="error___message">{errors.name.message}</span>
              )}
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

                <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
                  Thêm
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
