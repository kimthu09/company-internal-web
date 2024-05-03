"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LuFilter } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { stringToDate } from "@/lib/utils";
import DaypickerPopup from "../ui/daypicker-popup";
import { AiOutlineClose } from "react-icons/ai";
import ViewMoreLink from "../home/view-more-link";
import { toast } from "../ui/use-toast";
import markAllSeen from "@/lib/notification/markAllSeen";
import { useLoading } from "@/hooks/loading-context";
import Link from "next/link";
import { Input } from "../ui/input";
import getAllPosts from "@/lib/post/getAllPost";
import { News, Tag } from "@/types";
import NewsListItem from "./news-list-item";
import NewsListItemSkeleton from "./news-list-item-skeleton";
import TagList from "../tags/tag-list";
import getAllTags from "@/lib/tag/getAllTags";
type FormValues = {
  filters: {
    type: string;
    value: string;
  }[];
  tagIds: {
    tagId: string;
  }[];
};
const PostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ?? "10";
  let filters = [{ type: "", value: "" }];
  filters.pop();
  const filterValues = [
    { type: "title", name: "Tiêu đề" },
    { type: "updatedAtFrom", name: "Cập nhật từ ngày" },
    { type: "updatedAtTo", name: "Cập nhật đến ngày" },
    { type: "tags", name: "Tag" },
  ];
  const [latestFilter, setLatestFilter] = useState("");
  Array.from(searchParams.keys()).forEach((key: string) => {
    if (searchParams.get(key) && key !== "limit") {
      const existingFilterIndex = filters.findIndex(
        (filter) => filter.type === key
      );

      if (existingFilterIndex !== -1) {
      } else {
        filters.push({ type: key, value: searchParams.get(key)! });
      }
    }
  });
  const tagList = Array.from(searchParams.getAll("tags")).map((tag) => ({
    tagId: tag,
  }));
  const { register, handleSubmit, reset, control, getValues } =
    useForm<FormValues>({
      defaultValues: {
        filters: filters,
        tagIds: tagList,
      },
    });
  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: "filters",
  });
  const {
    fields: fieldsTag,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: control,
    name: "tagIds",
  });
  const filterString = filters
    .map((item) => `${item.type}=${encodeURIComponent(item.value.toString())}`)
    .join("&");
  const { posts, mutate, isLoading, isError } = getAllPosts({
    encodedString: filterString,
    filter: {
      page: "1",
      limit: limit,
    },
  });
  const {
    tags,
    isLoading: isLoadingTag,
    isError: isErrorTage,
    mutate: mutateTag,
  } = getAllTags();

  const { hideLoading, showLoading } = useLoading();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let stringToFilter = "";
    data.filters.forEach((item) => {
      if (item.type !== "tags") {
        stringToFilter = stringToFilter.concat(`&${item.type}=${item.value}`);
      }
    });
    data.tagIds.forEach((item) => {
      stringToFilter = stringToFilter.concat(`&tags=${item.tagId}`);
    });
    setOpenFilter(false);
    router.push(`/news?limit=10${stringToFilter}`);
  };
  const [openFilter, setOpenFilter] = useState(false);
  if (isLoading) {
    return <NewsListItemSkeleton number={3} />;
  } else if (isError || posts.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  }
  return (
    <div>
      <div className="pb-5 mb-7 border-b w-full flex flex-row justify-between items-center">
        <h1 className="table___title">Tất cả bài viết</h1>
        <Link className="link___primary" href={"/news/add"}>
          Thêm bài viết
        </Link>
      </div>
      <div className="w-full flex flex-col overflow-x-auto">
        <div className="mb-4 flex gap-3 basis-1/2 flex-wrap">
          <Popover
            open={openFilter}
            onOpenChange={(open) => {
              setOpenFilter(open);
              reset({ filters: filters });
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" className="lg:px-3 px-2 rounded-full">
                Lọc danh sách
                <LuFilter className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 ml-12 rounded-xl">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị danh sách theo
                  </p>
                </div>
                <div className="flex flex-col gap-4 max-h-[24rem] overflow-y-auto pb-[1px] pl-[1px]">
                  {fields.map((item, index) => {
                    const name = filterValues.find((v) => v.type === item.type);
                    return (
                      <div key={item.id}>
                        <label className="text-sm text-muted-foreground">
                          {name?.name}
                        </label>
                        <div className=" flex gap-1 items-center">
                          {item.type === "updatedAtFrom" ||
                          item.type === "updatedAtTo" ? (
                            <Controller
                              control={control}
                              name={`filters.${index}.value`}
                              render={({ field }) => {
                                return (
                                  <DaypickerPopup
                                    triggerClassname="flex-1"
                                    date={
                                      stringToDate(field.value) ?? new Date()
                                    }
                                    setDate={(date) => {
                                      if (date) {
                                        const formattedDate = format(
                                          date,
                                          "dd/MM/yyyy",
                                          { locale: vi }
                                        );
                                        field.onChange(formattedDate);
                                      } else {
                                        console.error("Invalid date:", date);
                                      }
                                    }}
                                  />
                                );
                              }}
                            />
                          ) : item.type === "title" ? (
                            <Input
                              {...register(`filters.${index}.value`)}
                              className="flex-1 rounded-xl"
                              type="text"
                            ></Input>
                          ) : item.type === "tags" ? (
                            <div className="flex-1">
                              <TagList
                                isEdit
                                classNames="rounded-xl h-10"
                                checkedTags={fieldsTag.map((tag) => +tag.tagId)}
                                onCheckChanged={(tagId) => {
                                  const selectedIndex = fieldsTag.findIndex(
                                    (tag) => tag.tagId === tagId.toString()
                                  );
                                  if (selectedIndex > -1) {
                                    removeTag(selectedIndex);
                                  } else {
                                    appendTag({ tagId: tagId.toString() });
                                  }
                                }}
                                onRemove={(index) => {
                                  removeTag(index);
                                }}
                              />
                            </div>
                          ) : null}
                          <Button
                            variant={"ghost"}
                            className={`h-9 w-9 p-0 rounded-full self-start`}
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <AiOutlineClose />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-[310px]">
                  <Select
                    value={latestFilter}
                    onValueChange={(value: string) => {
                      if (
                        value === "updatedAtFrom" ||
                        value === "updatedAtTo"
                      ) {
                        append({
                          type: value,
                          value: format(new Date(), "dd/MM/yyyy", {
                            locale: vi,
                          }),
                        });
                      } else {
                        append({ type: value, value: "" });
                      }
                    }}
                  >
                    <SelectTrigger
                      disabled={fields.length === filterValues.length}
                      className="w-full flex justify-center h-10 rounded-full mt-[1px] px-3 text-muted-foreground"
                    >
                      <SelectValue placeholder=" Chọn điều kiện lọc" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectGroup>
                        {filterValues.map((item) => {
                          return fields.findIndex(
                            (v) => v.type === item.type
                          ) === -1 ? (
                            <SelectItem key={item.type} value={item.type}>
                              {item.name}
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className={`bg-green-primary h-9 rounded-full px-3 hover:bg-green-hover w-[310px]`}
                >
                  Lọc danh sách
                  <LuFilter className="ml-1 h-5 w-5" />
                </Button>
              </form>
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 mt-2 flex-wrap">
            {filters.map((item, index) => {
              const name = filterValues.find((v) => v.type === item.type);
              if (item.type === "tags") {
                return null;
              } else
                return (
                  <div
                    key={item.type}
                    className="rounded-xl flex self-start px-3 py-1 h-fit outline-none text-sm text-primary bg-primary/10 items-center gap-1 whitespace-nowrap"
                  >
                    <p>
                      {name?.name}
                      {": "}
                      {item.value}
                    </p>
                  </div>
                );
            })}
            {tags ? (
              <>
                {tagList.map((item, index) => {
                  const name = tags.data.find(
                    (tag: Tag) => item.tagId === tag.id.toString()
                  );
                  return (
                    <div
                      key={item.tagId}
                      className="rounded-xl flex self-start px-3 py-1 h-fit outline-none text-sm text-primary bg-primary/10 items-center gap-1 whitespace-nowrap"
                    >
                      <p>{name?.name}</p>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </div>

        {posts.data.length > 0 ? (
          posts.data.map((item: News) => (
            <NewsListItem key={item.id} item={item} />
          ))
        ) : (
          <div className="flex justify-center py-20">
            Không tìm thấy kết quả.
          </div>
        )}
        {posts.paging.limit < posts.paging.totalElements ? (
          <div className="flex items-center justify-end space-x-2 py-4">
            <ViewMoreLink href={`/notifications?limit=${+limit + 10}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostPage;
