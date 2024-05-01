import { apiKey, endpoint } from "@/constants";
import { Unit } from "@/types";
import axios from "axios";
import useSWR from "swr";

const fetcher = async (url: string) => {
  // const token = await getApiKey();
  return axios
    .get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
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
