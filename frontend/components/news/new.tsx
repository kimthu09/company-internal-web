import { Post } from "@/components/news/upload";

export const samplePosts: Post[] = [
  {
    id: 1,
    content: "Khởi đầu cho một dự án mới!",
    likes: 10,
    comments: ["Chúc may mắn!"],
    postedDate: new Date(),
    author: "John Doe",
  },
  {
    id: 2,
    content: "Hôm nay công ty tổ chức buổi họp tổng kết dự án.",
    likes: 5,
    comments: ["Chúc mừng!", "Hy vọng buổi họp diễn ra suôn sẻ."],
    postedDate: new Date(), // Thêm thông tin ngày đăng
    author: "Jane Doe", // Thêm thông tin người đăng
  },
  {
    id: 3,
    content: "Một ngày làm việc hết sức hiệu quả!",
    likes: 15,
    comments: ["Chúc mừng bạn!", "Bạn đã làm việc chăm chỉ."],
    postedDate: new Date(), // Thêm thông tin ngày đăng
    author: "John Smith", // Thêm thông tin người đăng
  },
];
const NewAct = () => {
  return (
    <div className="p-7 rounded-2xl bg-white card-shadow xl:min-w-[24rem]">
      <h1 className="pb-5 border-b text-xl font-bold">Bảng tin gần đây</h1>
      {samplePosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 mt-4">
          <div className="font-bold">{post.author}</div>
          <div className="text-sm italic mb-2">
            {post.postedDate.toDateString()}
          </div>
          <p className="mb-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NewAct;
