"use client";

import ChangeManager from "@/components/manage/unit/change-manager";
import UnitDetailSkeleton from "@/components/manage/unit/unit-detail.skeleton";
import UnitTitleLinks from "@/components/manage/unit/unit-title-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useLoading } from "@/hooks/loading-context";
import getUnit from "@/lib/unit/getUnit";
import updateUnit from "@/lib/unit/updateUnit";
import { zodResolver } from "@hookform/resolvers/zod";
import { features } from "process";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
const FormSchema = z.object({
  features: z.array(z.object({ featureId: z.coerce.number() })),
});
const UnitDetail = ({ params }: { params: { unitId: string } }) => {
  const { data, isLoading, isError, mutate } = getUnit(params.unitId);
  const { showLoading, hideLoading } = useLoading();
  const [readOnly, setReadOnly] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "features",
  });

  const onSelect = (featureId: number) => {
    if (readOnly) {
      return;
    }
    const selectedIndex = fields.findIndex(
      (feature) => feature.featureId === featureId
    );
    if (selectedIndex > -1) {
      remove(selectedIndex);
    } else {
      append({ featureId: featureId });
    }
  };
  const resetForm = () => {
    if (data && !data.hasOwnProperty("message")) {
      const hasFeature: { featureId: number }[] = [];
      data.features.forEach((item) => {
        if (item.has) {
          hasFeature.push({ featureId: item.id });
        }
      });
      reset({ features: hasFeature });
    }
  };
  useEffect(() => {
    resetForm();
  }, [data]);
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    console.log(data);
    setReadOnly(true);
    showLoading();
    const response: Promise<any> = updateUnit({
      id: params.unitId,
      features: data.features.map((item) => item.featureId),
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
        description: "Chỉnh sửa chức năng phòng ban thành công",
      });
      mutate();
    }
  };
  if (isLoading) return <UnitDetailSkeleton />;
  else if (isError || data.hasOwnProperty("message"))
    return <div>Failed to load</div>;
  else
    return (
      <div className="card___style flex flex-col whitespace-nowrap">
        <UnitTitleLinks data={data} selectedPage={0} />

        <div className="flex gap-4 py-7 border-b justify-between">
          {data.manager ? (
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={data.manager.image} alt="avatar" />
                <AvatarFallback>
                  {data.manager.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="uppercase leading-6 text-base font-light">
                  Trưởng phòng
                </span>
                <span className="capitalize leading-6 text-base">
                  {data.manager.name}
                </span>
                <span className="text-sm leading-6 font-light">
                  {data.manager.email} | {data.manager.phone}
                </span>
              </div>
            </div>
          ) : (
            <span>Không có trưởng phòng</span>
          )}

          <ChangeManager unitId={params.unitId} />
        </div>
        <div className="flex flex-col py-7">
          <div className="flex justify-between">
            <label className="font-medium text-black" htmlFor="features">
              Chức năng
            </label>
            {readOnly ? (
              <Button
                className="font-semibold tracking-widest rounded-full hover:bg-hover-accent"
                onClick={() => setReadOnly(false)}
              >
                Sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  className="bg-white border-rose-700 text-rose-700 hover:text-rose-700 hover:bg-rose-50/30 whitespace-nowrap  font-semibold tracking-widest rounded-full"
                  onClick={() => {
                    setReadOnly(true);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="whitespace-nowrap bg-green-primary hover:bg-green-hover font-semibold tracking-widest rounded-full"
                  disabled={!isDirty}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Lưu
                </Button>
              </div>
            )}
          </div>

          <div className="col-span-2 grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-x-4 mt-4 items-end">
            {data.features.map((item) => (
              <div key={item.id} className="flex gap-1 items-baseline">
                <Checkbox
                  id={item.name}
                  checked={
                    fields.findIndex(
                      (feature) => feature.featureId === item.id
                    ) > -1
                  }
                  onClick={() => onSelect(item.id)}
                ></Checkbox>
                <label onClick={() => onSelect(item.id)}>{item.name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default UnitDetail;
