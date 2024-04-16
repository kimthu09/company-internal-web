import Image from "next/image";
import { newsList } from "./news-container";
import { IoPersonOutline } from "react-icons/io5";
const SmallNews = () => {
  const item = newsList[0];
  return (
    <div className="rounded-xl card-shadow overflow-clip bg-white">
      <Image
        className="object-contain w-full"
        src={
          "https://img.freepik.com/free-vector/world-environment-day-paper-style-background_23-2149394152.jpg?t=st=1713194631~exp=1713198231~hmac=7874e4fdef830b3ad4893aa422ca7f67aa137574204dd06f2183d5605c21cc1a&w=1380"
        }
        alt="image"
        width={400}
        height={400}
      />
      <div className="flex flex-col gap-3 p-7">
        <div className="flex flex-row">
          {item.tags.map((tag) => (
            <h2
              key={tag}
              className="uppercase text-xs mr-4 hover:text-primary transition-colors"
            >
              {tag}
            </h2>
          ))}
        </div>
        <h2 className="text-xl font-bold">{item.title}</h2>
        <div className="flex flex-row text-xs text-muted-foreground items-start">
          <IoPersonOutline className="h-4 w-4" />
          <p className="text-sm ml-3">{item.createdBy}</p>
          <p className="ml-auto">
            {item.createdDate.toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmallNews;
