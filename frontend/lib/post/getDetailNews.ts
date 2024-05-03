import { endpoint } from "@/constants";
import { Employee, News } from "@/types";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

const fetcher = async (url: string) => {
  const token = await getApiKey();
  return axios
    .get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};
export default function getDetailNews(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/post/${id}`,
    fetcher
  );

  return {
    data: data as News,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}
