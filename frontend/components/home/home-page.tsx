"use client";
import NewsContainer from "./news-container";
import Noti from "./noti";
import SmallNews from "./small-news";
// import "react-day-picker/dist/style.css";
import CalendarDayNight from "../calendar/personal/calendar-day-night";
const HomePage = () => {
  return (
    <div className="flex xl:flex-row flex-col-reverse">
      <div className="flex basis-2/3 flex-col gap-8 xl:mr-8">
        <NewsContainer
          limit="3"
          title="Bảng tin mới nhất"
          viewMoreHref="/news"
        />
        <NewsContainer
          limit="3"
          tagId="1"
          title="Góc kiến thức"
          viewMoreHref="/news?limit=10&tags=1"
        />
      </div>
      <div className="flex flex-col flex-1 justify-start gap-8 mb-8">
        <div className="flex xl:flex-col-reverse sm:flex-row flex-col gap-8">
          <Noti />
          <div className="flex justify-center rounded-xl card-shadow bg-white lg:min-w-[24rem]">
            <CalendarDayNight />
          </div>
        </div>
        <div className="flex xl:flex-col sm:flex-row flex-col gap-8">
          <SmallNews />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
