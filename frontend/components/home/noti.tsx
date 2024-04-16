import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Notification = {
  title: string;
  description: string;
  from: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
  createdAt: Date;
  seen: boolean;
};

const notifications: Notification[] = [
  {
    title: "Thông báo về việc nghỉ lễ",
    description:
      "Kì nghỉ quốc khánh sẽ bắt đầu từ ngày 29/04/2024 đến hết ngày 01/05/2024",
    from: {
      id: "1",
      name: "Nguyễn Thị Huệ",
      email: "hue@gmail.com",
    },
    createdAt: new Date(),
    seen: false,
  },
  {
    title: "Thông báo về việc nghỉ lễ",
    description:
      "Kì nghỉ quốc khánh sẽ bắt đầu từ ngày 29/04/2024 đến hết ngày 01/05/2024",
    from: {
      id: "1",
      name: "Nguyễn Thị Huệ",
      email: "hue@gmail.com",
    },
    createdAt: new Date(),
    seen: false,
  },
];
const Noti = () => {
  return (
    <div className="p-7 rounded-2xl bg-white card-shadow xl:min-w-[24rem]">
      <h1 className="pb-5 border-b text-xl font-bold">Thông báo</h1>
      {notifications.map((item, idx) => (
        <div key={idx} className="py-8 border-b flex flex-row gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
    </div>
  );
};

export default Noti;
