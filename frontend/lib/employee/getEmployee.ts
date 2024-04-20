import { apiKey, endpoint } from "@/constants";
import { Employee } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  // const token = await getApiKey();
  return fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  }).then((res) => {
    return res.json();
  });
};
export default function getEmployee(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/staff/${id}`,
    fetcher
  );

  return {
    data: data as Employee,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}
