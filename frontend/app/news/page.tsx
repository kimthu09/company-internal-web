"use client";

import NewAct from "@/components/news/new";
import UploadNews, { Post } from "@/components/news/upload";
import react, { useState } from "react";

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

const UnitManage = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId: number, comment: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  return (
    <div className="flex xl:flex-row flex-col-reverse">
      <div className="flex basis-2/3 flex-col gap-8 xl:mr-8">
        <h1 className="table___title border-b p-2">Bảng tin</h1>
        <UploadNews onAddPost={handleAddPost} />
        <h2 className="text-xl font-semibold mb-4">Các thông tin đã đăng</h2>
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="font-bold">{post.author}</div>
            <div className="text-sm italic mb-2">{post.postedDate.toDateString()}</div>
            <p className="mb-2">{post.content}</p>
            {post.file && (
              <div className="mb-2">
                <a
                  href={URL.createObjectURL(post.file)}
                  download={post.file.name}
                  className="text-blue-500"
                >
                  Tải xuống tệp
                </a>
              </div>
            )}
            <div className="flex items-center mb-2">
              <button onClick={() => handleLikePost(post.id)} className="mr-2">
                <span role="img" aria-label="Like">
                  Thích
                </span>{" "}
                {post.likes}
              </button>
              <button>
                <span role="img" aria-label="Comment">
                  Bình luận
                </span>{" "}
                {post.comments.length}
              </button>
            </div>
            <div>
              {post.comments.map((comment, index) => (
                <p key={index} className="text-gray-600 mb-1">
                  {comment}
                </p>
              ))}
              <input
                type="text"
                placeholder="Thêm bình luận..."
                className="w-full p-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-1 justify-start gap-8 mb-8">
        <div className="flex xl:flex-col-reverse sm:flex-row flex-col gap-8">
          <NewAct />
        </div>
      </div>
    </div>
  );
};

export default UnitManage;
