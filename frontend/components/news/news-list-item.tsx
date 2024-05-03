import { dateTimeStringFormat } from "@/lib/utils";
import { News } from "@/types";
import Image from "next/image";
import { IoPersonOutline } from "react-icons/io5";

const NewsListItem = ({ item }: { item: News }) => {
  return (
    <div className="py-8 border-b flex flex-row gap-8 ">
      <Image
        className="object-cover w-2/5 rounded-2xl"
        src={item.image}
        alt="image"
        width={300}
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
        <h2 className="text-lg font-bold">{item.title}</h2>
        <span className="text-sm text-gray-text one-line">
          {item.description}
        </span>

        <div className="flex flex-row text-xs text-muted-foreground items-start">
          <IoPersonOutline className="h-4 w-4" />
          <p className="text-sm ml-3">{item.createdBy.name}</p>
          <p className="ml-auto">{dateTimeStringFormat(item.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsListItem;
