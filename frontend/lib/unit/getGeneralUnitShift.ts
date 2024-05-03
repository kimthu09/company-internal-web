import { endpoint } from "@/constants";
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
    .then((json) => {
      return {
        shifts: json.shifts,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};

export default function getGeneralUnitShift({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/unit/${id}/shift`,
    fetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}
