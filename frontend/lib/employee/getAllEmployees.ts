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
        paging: json.page,
        data: json.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};

export default function getAllEmployees({
  filter,
  encodedString,
}: {
  filter?: EmployeeProps;
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
    `${endpoint}/staff?${encodeString}`,
    fetcher
  );

  return {
    employees: data,
    isLoading,
    isError: error,
    mutate,
  };
}
