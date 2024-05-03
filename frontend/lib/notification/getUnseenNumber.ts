import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type EmployeeProps = {
  limit?: string;
  page?: string;
  name?: string;
  email?: string;
  phone?: string;
  unit?: string;
  monthDOB?: number;
  yearDOB?: number;
};
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
        number: json.number,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};

export default function getUnseenNumber() {
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/notification/number_unseen`,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}
