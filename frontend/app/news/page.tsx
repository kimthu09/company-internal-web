"use client";

import NewAct from "@/components/news/new";
import UploadNews, { Post } from "@/components/news/upload";
import react, { useState } from "react";
import NotePicker from '@/components/news/notePicker'
import Note from '@/components/news/note'

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
        <NotePicker />
        
        <h2 className="text-xl font-semibold mb-4">Các thông tin đã đăng</h2>
        <Note/>
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
