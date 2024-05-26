"use client";

import { Player } from "@lottiefiles/react-lottie-player";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center gap-16 lg:mt-[10%] mt-[40%]">
      <Player
        autoplay
        loop
        src="/not-found-animation.json"
        style={{ height: "70%", width: "70%" }}
      />
      <h1 className="text-2xl text-blue-primary lg:text-3xl">
        Oops! Trang bạn đang tìm kiếm không tồn tại
      </h1>
    </div>
  );
};

export default NotFoundPage;
