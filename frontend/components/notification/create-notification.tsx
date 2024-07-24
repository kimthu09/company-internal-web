"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { endpoint, required } from "@/constants";
import { z } from "zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import StaffList from "../manage/employee/staff-filter-list";
import { AiOutlineClose } from "react-icons/ai";
import createNotification from "@/lib/notification/createNotification";
import { useLoading } from "@/hooks/loading-context";
import { toast } from "../ui/use-toast";
import { useSWRConfig } from "swr";
const Schema = z.object({
  title: required,
  description: z.string().max(200, "Tối đa 200 ký tự"),
  receivers: z.array(
    z.object({ userId: z.coerce.number(), userName: z.string() })
  ),
});
const CreateNotification = ({ onCreated }: { onCreated?: () => void }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof Schema>>({
    shouldUnregister: false,
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      description: "",
      receivers: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "receivers",
  });
  const [staff, setStaff] = useState(-1);
  const onSelect = (userId: number, name: string) => {
    const selectedIndex = fields.findIndex(
      (feature) => feature.userId === userId
    );
    console.log(selectedIndex);
    if (selectedIndex > -1) {
      return;
    } else {
      append({ userId: userId, userName: name });
    }
  };
  const { showLoading, hideLoading } = useLoading();
  const { mutate } = useSWRConfig();

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = async (data) => {
    console.log(data);
    const response: Promise<any> = createNotification({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        receivers: data.receivers.map((item) => item.userId),
      },
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
        description: "Gửi thông báo thành công",
      });
      if (onCreated) {
        onCreated();
      }
      mutate(`${endpoint}/notification/number_unseen`);
      reset({
        title: "",
        description: "",
        receivers: [],
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="link___primary no-underline font-normal text-base hover:no-underline"
          variant={"link"}
        >
          Gửi thông báo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Gửi thông báo</DialogTitle>
          <DialogDescription>
            Tạo thông báo mới và gửi đến nhân viên
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col ">
          <label className="font-medium mt-2 text-black" htmlFor="title">
            Tiêu đề <span className="error___message">*</span>
          </label>
          <div className="col-span-2">
            <Input
              id="title"
              className=" rounded-full"
              {...register("title")}
            ></Input>
            {errors.title && (
              <span className="error___message ml-3">
                {errors.title.message}
              </span>
            )}
          </div>
          <label className="font-medium mt-7 text-black" htmlFor="desc">
            Nội dung
          </label>
          <Textarea
            id="desc"
            className="rounded-2xl"
            {...register("description")}
            maxLength={200}
          />
          {errors.title && (
            <span className="error___message ml-3">{errors.title.message}</span>
          )}
          <div className="font-medium mt-7 text-black">
            Người nhận{" "}
            <span className="font-normal text-gray-text">
              (để trống nếu gửi cho tất cả nhân viên)
            </span>
          </div>
          <div className="flex gap-2 my-2">
            {fields.map((item, index) => {
              return (
                <div
                  key={item.userId}
                  className="rounded-xl flex self-start px-3 pr-1 py-1 h-fit outline-none text-sm text-primary bg-primary/10 items-center gap-1 whitespace-nowrap"
                >
                  <p>
                    {item.userName && item.userName !== ""
                      ? item.userName
                      : item.userId}
                  </p>
                  <AiOutlineClose
                    className="text-primary h-6 w-auto cursor-pointer p-1 px-2 hover:text-rose-500"
                    onClick={() => {
                      remove(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <StaffList
            isId
            staff={staff}
            setStaff={(value, name) => onSelect(+value, name ?? "")}
            isForActiveAndNotAdmin
          />

          <div className="flex gap-5 justify-end sm:self-end mt-7">
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
              className="sm:flex flex-1 whitespace-nowrap"
              onClick={() => {
                handleSubmit(onSubmit)();
                setOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotification;
