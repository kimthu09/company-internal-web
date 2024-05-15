"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { phoneRegex, required } from "@/constants";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import createEmployee from "@/lib/employee/createEmployee";
import { useLoading } from "@/hooks/loading-context";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UnitList from "@/components/manage/unit/unit-list";
import { toast } from "@/components/ui/use-toast";
const Schema = z.object({
  name: required,
  email: z.string().email("Email không hợp lệ"),
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
  userIdentity: z
    .string()
    .length(12, "Căn cước công dân phải đủ 12 số")
    .refine((value) => /^[0-9]+$/.test(value), {
      message: "Căn cước công dân chỉ chứa số",
    }),
});
const AddNewEmployee = () => {
  const { showLoading, hideLoading } = useLoading();

  const [date, setDate] = useState<Date>();
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
      name: "",
      email: "",
      phone: "",
      address: "",
      male: true,
      unit: -1,
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = async (data) => {
    const response: Promise<any> = createEmployee({
      employee: {
        name: data.name.trim(),
        email: data.email,
        phone: data.phone,
        dob: format(data.dob, "dd/MM/yyyy", { locale: vi }),
        userIdentity: data.userIdentity,
        address: data.address,
        unit: data.unit,
        male: data.male,
        image:
          "https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media",
      },
    });
    showLoading();
    const responseData = await response;

    hideLoading();

    console.log(responseData);
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
        description: "Thêm nhân viên thành công",
      });
      reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        userIdentity: "",
        male: true,
        unit: -1,
      });
    }
  };
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="card___style flex flex-col"
    >
      <div className="pb-5 md:mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Thêm nhân viên</h1>
        <Button className="font-semibold tracking-widest rounded-full hover:bg-hover-accent">
          Thêm
        </Button>
      </div>
      <div className="md:grid md:grid-cols-3 md:gap-y-7 flex flex-col text-gray-text">
        {/* name */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="name">
          Tên nhân viên <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
            id="name"
            className=" rounded-full"
            {...register("name")}
          ></Input>
          {errors.name && (
            <span className="error___message ml-3">{errors.name.message}</span>
          )}
        </div>

        {/* cccd */}
        <label
          className="font-medium md:mt-2 mt-7 text-black"
          htmlFor="userIdentity"
        >
          CCCD <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
            id="userIdentity"
            className=" rounded-full"
            {...register("userIdentity")}
          ></Input>
          {errors.userIdentity && (
            <span className="error___message ml-3">
              {errors.userIdentity.message}
            </span>
          )}
        </div>

        {/* email */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="email">
          Địa chỉ email <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
            id="email"
            className="col-span-2 rounded-full"
            {...register("email")}
          ></Input>
          {errors.email && (
            <span className="error___message ml-3">{errors.email.message}</span>
          )}
        </div>

        {/* phone */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="phone">
          Số điện thoại <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
            id="phone"
            className="col-span-2 rounded-full"
            {...register("phone")}
          ></Input>
          {errors.phone && (
            <span className="error___message ml-3">{errors.phone.message}</span>
          )}
        </div>

        {/* dob */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="dob">
          Ngày sinh <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
            onClick={(e) => e.preventDefault()}
            id="dob"
            type="date"
            className="col-span-2 rounded-full"
            {...register("dob")}
          ></Input>
          {errors.dob && (
            <span className="error___message ml-3">{errors.dob.message}</span>
          )}
        </div>

        {/* address */}
        <label
          className="font-medium md:mt-2 mt-7 text-black"
          htmlFor="address"
        >
          Địa chỉ <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Input
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
        {/* male */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="male">
          Giới tính <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Controller
            control={control}
            name="male"
            render={({ field }) => (
              <RadioGroup
                className="flex gap-4"
                defaultValue="true"
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
            <span className="error___message ml-3">{errors.male.message}</span>
          )}
        </div>

        {/* unit */}
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="unit">
          Phòng ban <span className="error___message">*</span>
        </label>
        <div className="col-span-2">
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <UnitList
                isId
                unit={field.value}
                setUnit={(unit: string | number) => field.onChange(unit)}
              />
            )}
          />
          {errors.unit && (
            <span className="error___message ml-3">{errors.unit.message}</span>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddNewEmployee;
