import { apiKey, endpoint } from "@/constants";
import { Feature } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  // const token = await getApiKey();
  return fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
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
