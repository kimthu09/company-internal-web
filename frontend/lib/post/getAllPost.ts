import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type PostProps = {
  limit?: string;
  page?: string;
  title?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  tags?: string;
};
export const fetcher = async (url: string) => {
  const token = await getApiKey();
  return axios
    .get(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .then((json) => {
      return {
        paging: json.page,
        data: json.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
};

export default function getAllPosts({
  filter,
  encodedString,
}: {
  filter?: PostProps;
  encodedString?: string;
}) {
  let encodeString = "";
  if (filter) {
    encodeString = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join("&");
  }
  if (encodedString) {
    encodeString = encodeString.concat("&").concat(encodedString);
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/post?${encodeString}`,
    fetcher
  );

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate,
  };
}
