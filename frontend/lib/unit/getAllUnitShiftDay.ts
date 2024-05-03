import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type UnitProps = {
  from: string;
  to: string;
  unitIds: number[];
};
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
        data: json.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
};

export default function getAllUnitShiftDay({ filter }: { filter?: UnitProps }) {
  let encodeString = "";
  if (filter) {
    encodeString = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join("&");
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/unit/shift/day?${encodeString}`,
    fetcher
  );

  return {
    data: data,
    isLoading,
    isError: error,
    mutate,
  };
}
