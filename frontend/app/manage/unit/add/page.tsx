"use client";
import UnitAddSkeleton from "@/components/manage/unit/unit-add-skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { required } from "@/constants";
import { useLoading } from "@/hooks/loading-context";
import createUnit from "@/lib/unit/createUnit";
import getAllFeature from "@/lib/unit/getAllFeatures";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
const FormSchema = z.object({
  name: required,
  features: z.array(z.object({ featureId: z.coerce.number() })),
});
const AddUnit = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const { features: featureList, isLoading, isError } = getAllFeature();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "features",
  });

  const onSelect = (featureId: number) => {
    const selectedIndex = fields.findIndex(
      (feature) => feature.featureId === featureId
    );
    console.log(selectedIndex);
    if (selectedIndex > -1) {
      remove(selectedIndex);
    } else {
      append({ featureId: featureId });
    }
  };
  const { showLoading, hideLoading } = useLoading();
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    console.log(data);
    const response: Promise<any> = createUnit({
      unit: {
        name: data.name,
        features: data.features.map((item) => item.featureId),
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
        description: "Thêm phòng ban thành công",
      });
      reset({
        name: "",
        features: [],
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
        <h1 className="table___title">Thêm phòng ban</h1>
        <Button className="font-semibold tracking-widest rounded-full hover:bg-hover-accent">
          Thêm
        </Button>
      </div>
      <div className="md:grid md:grid-cols-3 md:gap-y-7 flex flex-col text-gray-text">
        <label className="font-medium md:mt-2 mt-7 text-black" htmlFor="name">
          Tên phòng ban <span className="error___message">*</span>
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
        <label
          className="font-medium md:mt-2 mt-7 text-black"
          htmlFor="features"
        >
          Chức năng <span className="error___message">*</span>
        </label>
        <div className="col-span-2 grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-x-4 md:mt-0 mt-4 items-end">
          {isLoading ? (
            <UnitAddSkeleton />
          ) : isError ? (
            <div>Fail to load</div>
          ) : (
            featureList.map((item) => (
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
            ))
          )}
        </div>
      </div>
    </form>
  );
};

export default AddUnit;
