import Image from "next/image";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { IoPersonOutline } from "react-icons/io5";
type News = {
  id: string;
  title: string;
  image?: string;
  tags: string[];
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
};

export const newsList: News[] = [
  {
    id: "1",
    title: "This is the title",
    tags: ["latest", "training", "events"],
    createdDate: new Date(),
    createdBy: "Someone",
    modifiedDate: new Date(),
  },
  {
    id: "2",
    title: "This is the title",
    tags: ["latest", "training", "events"],
    createdDate: new Date(),
    createdBy: "Someone",
    modifiedDate: new Date(),
  },
  {
    id: "3",
    title: "This is the title",
    tags: ["latest", "training", "events"],
    createdDate: new Date(),
    createdBy: "Someone",
    modifiedDate: new Date(),
  },
];
const NewsContainer = () => {
  return (
    <div className="p-7 rounded-2xl bg-white shadow-[0_3px_20px_#1d26260d] flex flex-col">
      <h1 className="pb-5 border-b text-xl font-bold">Bảng tin mới nhất</h1>
      {newsList.map((item) => (
        <div key={item.id} className="py-8 border-b flex flex-row gap-8 ">
          <Image
            className="object-contain w-2/5 rounded-2xl"
            src={
              "https://img.freepik.com/free-vector/world-environment-day-paper-style-background_23-2149394152.jpg?t=st=1713194631~exp=1713198231~hmac=7874e4fdef830b3ad4893aa422ca7f67aa137574204dd06f2183d5605c21cc1a&w=1380"
            }
            alt="image"
            width={400}
            height={400}
          />
          <div className="flex flex-col gap-3 self-center w-full ">
            <div className="flex flex-row flex-wrap gap-3">
              {item.tags.map((tag) => (
                <h2
                  key={tag}
                  className="uppercase text-xs  hover:text-primary transition-colors"
                >
                  {tag}
                </h2>
              ))}
            </div>
            <h2 className="text-lg font-bold">{item.title}</h2>
            <div className="flex flex-row text-xs text-muted-foreground items-start">
              <IoPersonOutline className="h-4 w-4" />
              <p className="text-sm ml-3">{item.createdBy}</p>
              <p className="ml-auto">
                {item.createdDate.toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      ))}
      <Link
        href="#"
        className="uppercase text-xs font-bold hover:text-primary transition-colors tracking-wider mt-5 flex flex-row items-center gap-2"
      >
        Xem thêm
        <GoArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default NewsContainer;
