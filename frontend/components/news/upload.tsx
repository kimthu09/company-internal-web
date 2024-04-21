"use client";
import react, { useState } from "react";

export type Post = {
  id: number;
  content: string;
  file?: File;
  likes: number;
  comments: string[];
  postedDate: Date;
  author: string;
};

interface NewPostFormProps {
  onAddPost: (newPost: Post) => void;
}

const UploadNews = ({ onAddPost }: NewPostFormProps) => {
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined); // Chỉ định rõ kiểu dữ liệu của file

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPost: Post = {
      id: Date.now(),
      content: postContent,
      file,
      likes: 0,
      comments: [],
      postedDate: new Date(),
      author: "You",
    };
    onAddPost(newPost);
    setPostContent("");
    setFile(undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Đăng thông tin mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Nhập nội dung thông tin..."
            value={postContent}
            onChange={handleContentChange}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Chọn tệp
          </label>
          {file && <span className="ml-2">{file.name}</span>}
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Đăng
        </button>
      </form>
    </div>
  );
};

export default UploadNews;
