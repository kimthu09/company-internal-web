import { apiKey, endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";

const fetcher = async (url: string) => {
  // const token = await getApiKey();
  return axios
    .get(url, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${apiKey}`,
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
      return error.response.data;
    });
};

export default function getAllRoom({
  name,
  page,
}: {
  name: string;
  page?: string;
}) {
  const encodedString = name ? `&name=${encodeURIComponent(name)}` : "";
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/meeting_room?page=${page ?? "1"}&limit=10${encodedString}`,
    fetcher
  );

  return {
    rooms: data,
    isLoading,
    isError: error,
    mutate,
  };
}
