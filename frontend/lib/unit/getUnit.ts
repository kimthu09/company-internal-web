import { apiKey, endpoint } from "@/constants";
import { Unit } from "@/types";
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
export default function getUnit(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/unit/${id}`,
    fetcher
  );

  return {
    data: data as Unit,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}
