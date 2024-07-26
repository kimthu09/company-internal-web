"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { phoneRegex, required } from "@/constants";
import { useLoading } from "@/hooks/loading-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { AiOutlineClose } from "react-icons/ai";
import { FaPen } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUpload } from "@/lib/employee/uploadImage";
import DetailSkeleton from "@/components/manage/employee/detail-skeleton";
import ChangeImage from "@/components/manage/employee/change-image";
import getProfile from "@/lib/profile/getProfile";
import updateProfile from "@/lib/profile/updateProfile";

const FormSchema = z.object({
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  address: required,
});
const ProfileScreen = () => {
  const { showLoading, hideLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const { data: employee, isLoading, isError, mutate } = getProfile();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;
  const resetForm = () => {
    reset({
      phone: employee.phone,
      address: employee.address,
    });
  };
  useEffect(() => {
    if (employee && !employee.hasOwnProperty("message")) {
      resetForm();
    }
  }, [employee]);

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    console.log(data);
    setReadOnly(true);
    showLoading();
    const response: Promise<any> = updateProfile({
      address: data.address,
      phone: data.phone,
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
        description: "Chỉnh sửa thông tin thành công",
      });
      mutate();
    }
  };

  const [image, setImage] = useState<any>();
  const handleImageSelected = async () => {
    if (!image) {
      return;
    }
    let formData = new FormData();

    formData.append("file", image);
    formData.append("folderName", "avatars");
    showLoading();
    const imgRes = await imageUpload(formData);
    if (
      imgRes.hasOwnProperty("response") &&
      imgRes.response.hasOwnProperty("data") &&
      imgRes.response.data.hasOwnProperty("message") &&
      imgRes.response.data.hasOwnProperty("status")
    ) {
      hideLoading();

      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: imgRes.message,
      });
      return;
    } else if (imgRes.hasOwnProperty("code") && imgRes.code.includes("ERR")) {
      hideLoading();

      toast({
        variant: "destructive",
        title: "Có lỗi",
        description: imgRes.message,
      });
      return;
    } else {
      console.log(imgRes);
      const response: Promise<any> = updateProfile({
        image: imgRes.file,
      });
      const data = await response;
      hideLoading();

      if (data.hasOwnProperty("errorKey")) {
        toast({
          variant: "destructive",
          title: "Có lỗi",
          description: data.message,
        });
      } else {
        toast({
          variant: "success",
          title: "Thành công",
          description: "Thay đổi ảnh đại diện thành công",
        });
        mutate();
      }
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  } else if (isError || employee.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div className="card___style flex sm:flex-row flex-col-reverse gap-8">
        <div className="flex-1 flex-col flex gap-4">
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="name"
            >
              Tên người dùng
            </label>
            <Input
              readOnly
              value={employee.name}
              id="name"
              className=" rounded-full bg-gray-100"
            ></Input>
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="cccd"
            >
              CCCD
            </label>
            <Input
              readOnly
              id="cccd"
              className=" rounded-full bg-gray-100"
              value={employee.userIdentity}
            ></Input>
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="phone"
            >
              Số điện thoại <span className="error___message">*</span>
            </label>
            <Input
              readOnly={readOnly}
              id="phone"
              className="col-span-2 rounded-full"
              {...register("phone")}
            ></Input>
            {errors.phone && (
              <span className="error___message ml-3">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="dob"
            >
              Ngày sinh
            </label>
            <Input
              readOnly
              id="dob"
              className="col-span-2 rounded-full bg-gray-100"
              value={employee.dob}
            ></Input>
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="address"
            >
              Địa chỉ <span className="error___message">*</span>
            </label>
            <Input
              readOnly={readOnly}
              id="address"
              className="col-span-2 rounded-full"
              {...register("address")}
            ></Input>
            {errors.address && (
              <span className="error___message ml-3">
                {errors.address.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="male"
            >
              Giới tính
            </label>
            <RadioGroup
              disabled
              className="flex gap-4"
              value={employee.male ? "true" : "false"}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="true"
                  id="r1"
                  className="text-gray-500 border-gray-500"
                />
                <label htmlFor="r1" className="font-normal">
                  Nam
                </label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="false"
                  id="r2"
                  className="text-gray-500 border-gray-500"
                />
                <label className="font-normal" htmlFor="r2">
                  Nữ
                </label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="unit"
            >
              Phòng ban
            </label>
            <Input
              readOnly
              id="unit"
              className="col-span-2 rounded-full bg-gray-100"
              value={employee.unit.name}
            ></Input>
          </div>
          <div className="flex gap-2 justify-end sm:flex-row flex-col">
            <div className="flex gap-2 justify-center">
              {!readOnly ? (
                <div className="flex gap-2 sm:flex-initial flex-1">
                  <Button
                    variant={"outline"}
                    className="bg-white border-rose-700 text-rose-700 hover:text-rose-700 hover:bg-rose-50/30 px-2 flex gap-1 flex-nowrap whitespace-nowrap flex-1"
                    onClick={() => {
                      setReadOnly(true);
                      resetForm();
                    }}
                  >
                    <AiOutlineClose className="h-5 w-5" />
                    Hủy
                  </Button>
                  <ConfirmDialog
                    title={"Xác nhận"}
                    description="Bạn xác nhận chỉnh sửa thông tin ?"
                    handleYes={() => handleSubmit(onSubmit)()}
                  >
                    <Button
                      className="px-2 flex gap-1 flex-nowrap whitespace-nowrap flex-1 bg-green-primary hover:bg-green-hover"
                      disabled={!isDirty}
                    >
                      <LuCheck className="h-5 w-5" />
                      Lưu
                    </Button>
                  </ConfirmDialog>
                </div>
              ) : null}
              <Button
                title="Chỉnh sửa"
                className={`px-2 sm:flex-initial flex-1 flex gap-1 flex-nowrap whitespace-nowrap ${
                  readOnly ? "" : "hidden"
                }`}
                type="button"
                onClick={() => {
                  setReadOnly(false);
                }}
              >
                <FaPen />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-min">
          <Avatar className="w-40 h-40">
            <AvatarImage src={employee.image} alt="avatar" />
            <AvatarFallback>
              {employee.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChangeImage
            image={image}
            setImage={setImage}
            handleImageSelected={handleImageSelected}
            currentImage={employee.image}
          />
        </div>
      </div>
    );
  }
};

export default ProfileScreen;
