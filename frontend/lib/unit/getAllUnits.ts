import { apiKey, endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";

export type UnitProps = {
  limit?: string;
  page?: string;
  name?: string;
  manager?: string;
};
const fetcher = (url: string) => {
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

export default function getAllUnits({
  filter,
  encodedString,
}: {
  filter?: UnitProps;
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
    `${endpoint}/unit?${encodeString}`,
    fetcher
  );

  return {
    units: data,
    isLoading,
    isError: error,
    mutate,
  };
}
