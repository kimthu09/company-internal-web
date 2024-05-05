import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Notification } from "@/types";
import { dateTimeStringFormat } from "@/lib/utils";
import { LuCheck } from "react-icons/lu";
import markAsSeen from "@/lib/notification/markAsSeen";
import { useLoading } from "@/hooks/loading-context";
import { toast } from "../ui/use-toast";
import { useSWRConfig } from "swr";
import { endpoint } from "@/constants";

const NotificationItem = ({
  item,
  onUpdated,
}: {
  item: Notification;
  onUpdated: () => void;
}) => {
  const { mutate } = useSWRConfig();
  const { showLoading, hideLoading } = useLoading();
  const onSumit = async () => {
    const response: Promise<any> = markAsSeen({ id: item.id.toString() });
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
      if (onUpdated) {
        onUpdated();
      }
      mutate(`${endpoint}/notification/number_unseen`);
    }
  };

  return (
    <div
      className={`py-4 my-2 border-b border-b-border flex flex-row gap-3 pl-2 border-l-4 ${item.seen ? "border-white" : "border-primary"
        }`}
    >
      <Avatar>
        <AvatarImage src={item.from.image} alt="@shadcn" />
        <AvatarFallback>{item.from.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex text-sm items-center">
          <h2 className="font-medium text-lg">{item.from.name}</h2>
          <h2 className="font-medium text-gray-text ml-auto text-sm">
            {dateTimeStringFormat(item.createdAt)}
          </h2>
          {item.seen ? null : (
            <div
              className="hover:text-primary text-gray-text transition-colors cursor-pointer p-1"
              title="Đánh dấu đã đọc"
              onClick={() => onSumit()}
            >
              <LuCheck className="h-5 w-5" />
            </div>
          )}
        </div>
        <span className="font-medium">{item.title} </span>
        <div>
          <span className="font-light ">{item.description}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
