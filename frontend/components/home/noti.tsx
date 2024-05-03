"use client";
import getUnseeNotifications from "@/lib/notification/getUnseenNotification";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ViewMoreLink from "./view-more-link";
import BookingItemSkeleton from "../calendar/resources/booking-item-skeleton";
import { Notification } from "@/types";
import NotiListSkeleton from "../notification/noti-list-skeleton";

const Noti = () => {
  const { notifications, mutate, isLoading, isError } = getUnseeNotifications();
  if (isLoading) {
    return (
      <div className="p-7 rounded-2xl bg-white card-shadow flex-1">
        <NotiListSkeleton number={2} />
      </div>
    );
  } else if (isError || notifications.hasOwnProperty("message")) {
    return <div>Failed to load</div>;
  }
  return (
    <div className="p-7 rounded-2xl bg-white card-shadow xl:min-w-[24rem]">
      <h1 className="pb-5 border-b text-xl font-bold">Thông báo</h1>
      {notifications.data.slice(0, 2).map((item: Notification, idx: number) => (
        <div key={idx} className="py-8 border-b flex flex-row gap-3">
          <Avatar>
            <AvatarImage src={item.from.image} alt="avatar" />
            <AvatarFallback>{item.from.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium">{item.from.name}</h2>
            <div className="two-line">
              <span className="font-bold">{item.title} </span>
              <span className="font-light ">- {item.description}</span>
            </div>
          </div>
        </div>
      ))}
      <ViewMoreLink href="/notifications" />
    </div>
  );
};

export default Noti;
