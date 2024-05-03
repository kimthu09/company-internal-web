import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

const fetcher = async (url: string) => {
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

export default function getAllResources({
  name,
  page,
  limit,
}: {
  name: string;
  page?: string;
  limit?: string;
}) {
  const encodedString = name ? `&name=${encodeURIComponent(name)}` : "";
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/resource?page=${page ?? "1"}&limit=${
      limit ?? "10"
    }${encodedString}`,
    fetcher
  );

  return {
    resources: data,
    isLoading,
    isError: error,
    mutate,
  };
}
