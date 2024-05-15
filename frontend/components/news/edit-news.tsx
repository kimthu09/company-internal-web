"use client";

import { useLoading } from "@/hooks/loading-context";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import createNewNews from "@/lib/post/createNewNews";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LuCheck } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TagList from "@/components/tags/tag-list";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import { useEffect, useState } from "react";
import React from "react";
import { imageUpload } from "@/lib/employee/uploadImage";
import { useRouter } from "next/navigation";
import { News } from "@/types";
import getDetailNews from "@/lib/post/getDetailNews";
import NewsDetailSkeleton from "./news_detail_skeleton";
import updateNewNews from "@/lib/post/updateNew";
import updateNews from "@/lib/post/updateNew";

const Schema = z.object({
  title: z.string().min(1, "Không được để trống").max(100, "Tối đa 100 ký tự"),
  description: z.string().max(200, "Tối đa 200 ký tự"),
  image: z.string(),
  tagIds: z.array(z.object({ tagId: z.coerce.number() })),
});

const EditorBlock = dynamic(() => import("./editor"), {
  ssr: false,
});

const EditNews = ({ params }: { params: { newsId: number } }) => {
  const router = useRouter();
  function redirectToNews() {
    router.push("/news");
  }
  const [image, setImage] = useState<any>();
  const [imagePreviews, setImagePreviews] = useState<any>();
  const handleMultipleImage = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file && file.type.includes("image")) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImage(null);
        toast({
          variant: "destructive",
          title: "Có lỗi",
          description: "File không hợp lệ",
        });
        console.log("file không hợp lệ");
      }
    } else {
      setImage(null);
    }
  };

  const { showLoading, hideLoading } = useLoading();
  const [content, setContent] = useState<OutputData>({
    version: "2.1.0",
    time: Date.now(),
    blocks: [],
  });
  const [news, setNews] = useState<News>();

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const {
    fields: fieldsTag,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: control,
    name: "tagIds",
  });
  const onErrors: SubmitErrorHandler<z.infer<typeof Schema>> = (data) => {
    console.log(data);
    toast({
      variant: "destructive",
      title: "Có lỗi",
      description: "Vui lòng thử lại sau",
    });
  };
  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = async (data) => {
    if (image) {
      let formData = new FormData();

      formData.append("file", image);
      formData.append("folderName", "images");
      showLoading();
      const imgRes = await imageUpload(formData);
      if (
        imgRes.hasOwnProperty("response") &&
        imgRes.response.hasOwnProperty("data") &&
        imgRes.response.data.hasOwnProperty("message") &&
        imgRes.response.data.hasOwnProperty("status")
      ) {
        toast({
          variant: "destructive",
          title: "Có lỗi",
          description: imgRes.message,
        });
        return;
      } else if (imgRes.hasOwnProperty("code") && imgRes.code.includes("ERR")) {
        toast({
          variant: "destructive",
          title: "Có lỗi",
          description: imgRes.message,
        });
        return;
      }

      data.image = imgRes.file;
    }

    const response: Promise<any> = updateNews({
      id: params.newsId.toString(),
      title: data.title,
      description: data.description,
      content: content,
      image: data.image,
      tags: data.tagIds.map((item) => item.tagId),
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
        description: "Chỉnh sửa bài báo mới thành công",
      });
      setImage(null);

      redirectToNews();
    }
  };
  const { data, isLoading, isError, mutate } = getDetailNews(params.newsId);
  const resetForm = () => {
    reset({
      title: data?.title,
      description: data?.description,
      tagIds: data?.tags.map((item) => {
        return { tagId: item.id };
      }),
      image: data?.image,
    });
    setImage(null);
  };
  useEffect(() => {
    if (data && !data.hasOwnProperty("message")) {
      resetForm();
      setNews(data);
      setContent(data.content);
    }
  }, [data]);
  if (isLoading) {
    return <NewsDetailSkeleton />;
  } else if (news == undefined) {
    return <div>Failed to load</div>;
  } else {
    return (
      <div className="flex flex-col gap-7">
        <h1 className="table___title">Thêm bảng tin mới</h1>
        <form onSubmit={handleSubmit(onSubmit, onErrors)}>
          <div className="flex flex-col gap-7">
            <div className="flex lg:flex-row flex-col gap-7">
              <div className="card___style basis-3/4 flex flex-col">
                <label className="font-medium text-black" htmlFor="title">
                  Tiêu đề <span className="error___message">*</span>
                </label>
                <div className="col-span-2">
                  <Input
                    id="title"
                    className="col-span-2 rounded-full"
                    {...register("title")}
                  ></Input>
                  {errors.title && (
                    <span className="error___message ml-3">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <label
                  className="font-medium mt-7 text-black"
                  htmlFor="description"
                >
                  Mô tả
                </label>
                <div className="col-span-2">
                  <Textarea
                    id="description"
                    className="col-span-2 rounded-2xl"
                    {...register("description")}
                  ></Textarea>
                  {errors.description && (
                    <span className="error___message ml-3">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="card___style basis-1/4 flex flex-col gap-7">
                <div>
                  <span className="w-2/3 font-medium">
                    Tags <span className="error___message">*</span>
                  </span>
                  <TagList
                    isEdit
                    canAdd
                    checkedTags={fieldsTag.map((tag) => tag.tagId)}
                    onCheckChanged={(tagId) => {
                      const selectedIndex = fieldsTag.findIndex(
                        (tag) => tag.tagId === tagId
                      );
                      if (selectedIndex > -1) {
                        removeTag(selectedIndex);
                      } else {
                        appendTag({ tagId: tagId });
                      }
                    }}
                    onRemove={(index) => {
                      removeTag(index);
                    }}
                  />
                  {errors.tagIds && (
                    <span className="error___message">
                      {errors.tagIds.message}
                    </span>
                  )}
                </div>
                <div>
                  <span className="w-2/3 font-medium">
                    Hình ảnh <span className="error___message">*</span>
                  </span>

                  <Input
                    id="img"
                    type="file"
                    onChange={handleMultipleImage}
                  ></Input>
                  <div>
                    {image && imagePreviews ? (
                      <img
                        src={imagePreviews}
                        alt={`Preview`}
                        className="h-24 w-auto object-cover"
                      />
                    ) : (
                      <img
                        src={data.image ?? "/no-image.jpg"}
                        alt="ảnh"
                        className="h-24 w-auto object-cover"
                      ></img>
                    )}
                  </div>
                  {errors.image && (
                    <span className="error___message">
                      {errors.image.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="card___style flex flex-col gap-4">
              <EditorBlock
                data={content}
                onChange={setContent}
                holder="editorjs-container"
                readonly={false}
              />
            </div>
            <div className="flex md:justify-end justify-stretch gap-2">
              <Button
                className="px-4 pl-2 md:flex-none  flex-1"
                type="button"
                onClick={() => handleSubmit(onSubmit, onErrors)()}
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <LuCheck />
                  Lưu
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default EditNews;
