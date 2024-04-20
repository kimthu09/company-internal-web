"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { phoneRegex, required } from "@/constants";
import { useLoading } from "@/hooks/loading-context";
import getEmployee from "@/lib/employee/getEmployee";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import UnitList from "../unit/unit-list";
import { AiOutlineClose } from "react-icons/ai";
import { FaPen } from "react-icons/fa";
import { LuCheck } from "react-icons/lu";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import updateEmployee from "@/lib/employee/updateEmployee";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChangeImage from "./change-image";
import { imageUpload } from "@/lib/employee/uploadImage";
import DetailSkeleton from "./detail-skeleton";

const FormSchema = z.object({
  name: required,
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  address: required,
  dob: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message:
        issue.code === "invalid_date" ? "Ngày không hợp lệ" : defaultError,
    }),
  }),
  male: z.boolean(),
  unit: z
    .number({ invalid_type_error: "Lựa chọn không hợp lệ" })
    .min(1, "Vui lòng chọn phòng ban"),
});
const EmployeeEditDetail = ({ params }: { params: { employeeId: string } }) => {
  const { showLoading, hideLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const {
    data: employee,
    isLoading,
    isError,
    mutate,
  } = getEmployee(params.employeeId);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = form;
  const resetForm = () => {
    var dateParts = employee.dob.split("/");
    var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    console.log(dateObject);
    reset({
      name: employee.name,
      phone: employee.phone,
      address: employee.address,
      dob: dateObject,
      male: employee.male,
      unit: employee.unit.id,
    });
  };
  useEffect(() => {
    if (employee) {
      resetForm();
    }
  }, [employee]);

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    console.log(data);
    setReadOnly(true);
    showLoading();
    const response: Promise<any> = updateEmployee({
      id: params.employeeId,
      address: data.address,
      phone: data.phone,
      name: data.name,
      image: employee.image,
      male: data.male,
      unit: data.unit,
      dob: format(data.dob, "dd/MM/yyyy", { locale: vi }),
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
        description: "Chỉnh sửa nhân viên thành công",
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
      const response: Promise<any> = updateEmployee({
        id: params.employeeId,
        address: employee.address,
        phone: employee.phone,
        name: employee.name,
        image: imgRes.file,
        male: employee.male,
        unit: employee.unit.id,
        dob: format(employee.dob, "dd/MM/yyyy", { locale: vi }),
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
          description: "Thay đổi ảnh nhân viên thành công",
        });
        mutate();
      }
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  } else {
    return (
      <div className="card___style flex sm:flex-row flex-col-reverse gap-8">
        <div className="flex-1 flex-col flex gap-4">
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="name"
            >
              Tên nhân viên <span className="error___message">*</span>
            </label>
            <Input
              readOnly={readOnly}
              id="name"
              className=" rounded-full"
              {...register("name")}
            ></Input>
            {errors.name && (
              <span className="error___message ml-3">
                {errors.name.message}
              </span>
            )}
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
              Ngày sinh <span className="error___message">*</span>
            </label>
            <Controller
              control={control}
              name="dob"
              render={({ field }) => (
                <Input
                  readOnly={readOnly}
                  onClick={(e) => e.preventDefault()}
                  id="dob"
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value || ""
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  type="date"
                  className="col-span-2 rounded-full"
                ></Input>
              )}
            />

            {errors.dob && (
              <span className="error___message ml-3">{errors.dob.message}</span>
            )}
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
              Giới tính <span className="error___message">*</span>
            </label>
            <Controller
              control={control}
              name="male"
              render={({ field }) => (
                <RadioGroup
                  disabled={readOnly}
                  className="flex gap-4"
                  defaultValue={employee.male ? "true" : "false"}
                  value={field.value ? "true" : "false"}
                  onValueChange={(e: string) => field.onChange(e === "true")}
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="true" id="r1" />
                    <label htmlFor="r1" className="font-normal">
                      Nam
                    </label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="false" id="r2" />
                    <label className="font-normal" htmlFor="r2">
                      Nữ
                    </label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.male && (
              <span className="error___message ml-3">
                {errors.male.message}
              </span>
            )}
          </div>
          <div>
            <label
              className="font-medium md:mt-2 mt-7 text-black"
              htmlFor="unit"
            >
              Phòng ban <span className="error___message">*</span>
            </label>
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <UnitList
                  readonly={readOnly}
                  isId
                  unit={field.value}
                  setUnit={(unit: string | number) => field.onChange(unit)}
                />
              )}
            />
            {errors.unit && (
              <span className="error___message ml-3">
                {errors.unit.message}
              </span>
            )}
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
                    description="Bạn xác nhận chỉnh sửa thông tin nhân viên này ?"
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
                className="px-2 sm:flex-initial flex-1 flex gap-1 flex-nowrap whitespace-nowrap"
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

export default EmployeeEditDetail;
