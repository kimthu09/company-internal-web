import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

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
      return error.response.data;
    });
};

export default function getUnseeNotifications() {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/notification/unseen`,
    fetcher,
  );

  return {
    notifications: data,
    isLoading,
    isError: error,
    mutate,
  };
}
