import { endpoint } from "@/constants";
import { Feature } from "@/types";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

const fetcher = async (url: string) => {
  const token = await getApiKey();
  return fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => json.data);
};

export default function getAllFeature() {
  const { data, error, isLoading } = useSWR(`${endpoint}/feature`, fetcher);

  return {
    features: data as Feature[],
    isLoading,
    isError: error,
  };
}
