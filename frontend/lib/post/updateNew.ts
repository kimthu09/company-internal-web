import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";
import { OutputData } from "@editorjs/editorjs";

export default async function updateNews({
  id,
  title,
  description,
  content,
  image,
  tags,
}: {
  id: string;
  title: string;
  description: string;
  content: OutputData;
  image: string;
  tags: number[];
}) {
  const url = `${endpoint}/post/${id}`;
  const token = await getApiKey();

  const data = {
    title,
    description,
    content,
    image,
    tags,
  };

  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .put(url, data, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);

      return error;
    });
  return res;
}
