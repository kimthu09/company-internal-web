import { dateTimeStringFormat } from "@/lib/utils";
import { News } from "@/types";
import Image from "next/image";
import { IoPersonOutline } from "react-icons/io5";
import ConfirmDialog from "../ui/confirm-dialog";
import { Button } from "../ui/button";
import { FaTrash } from "react-icons/fa";
import { useLoading } from "@/hooks/loading-context";
import deletePost from "@/lib/post/deletePost";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import { endpoint } from "@/constants";

const NewsListItem = ({
  item,
  canDelete,
  onDeleted,
}: {
  item: News;
  canDelete?: boolean;
  onDeleted?: () => void;
}) => {
  const { showLoading, hideLoading } = useLoading();
  const onDelete = async ({ id }: { id: number }) => {
    const response: Promise<any> = deletePost({
      id: id.toString(),
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
        description: "Xóa bài viết thành công",
      });
      if (onDeleted) {
        onDeleted();
      }
    }
  };
  return (
    <div className="py-8 border-b flex flex-row gap-8 group">
      <Image
        className="object-cover w-2/5 rounded-2xl aspect-[3/2] h-[150px]"
        src={item.image}
        alt="image"
        width={450}
        height={300}
      />
      <div className="flex flex-col gap-3 self-center w-full ">
        <div className="flex flex-row flex-wrap gap-3">
          {item.tags.map((tag) => (
            <h2
              key={tag.id}
              className="uppercase text-xs  hover:text-primary transition-colors"
            >
              {tag.name}
            </h2>
          ))}
        </div>
        <Link
          className="text-lg font-bold group-hover:text-primary transition-colors one-line"
          href={"/news/" + item.id}
        >
          {item.title}
        </Link>
        <span className="text-sm text-gray-text one-line">
          {item.description}
        </span>

        <div className="flex flex-row text-xs text-muted-foreground items-start">
          <IoPersonOutline className="h-4 w-4" />
          <p className="text-sm ml-3">{item.createdBy.name}</p>
          <p className="ml-auto">{dateTimeStringFormat(item.updatedAt)}</p>
        </div>
      </div>
      <ConfirmDialog
        title={"Xác nhận"}
        description="Bạn xác nhận muốn xóa bài viết ?"
        handleYes={() => {
          onDelete({ id: item.id });
        }}
      >
        <Button
          title="Xoá bài viết"
          size={"icon"}
          variant={"ghost"}
          className={`rounded-full  text-rose-500 hover:text-rose-600 ${
            canDelete ? "visible" : "collapse"
          }`}
        >
          <FaTrash />
        </Button>
      </ConfirmDialog>
    </div>
  );
};

export default NewsListItem;
