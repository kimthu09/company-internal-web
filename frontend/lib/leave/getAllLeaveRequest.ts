import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type RequestProps = {
  limit?: string;
  page?: string;
  dateFrom?: string;
  dateTo?: string;
  isRejected?: boolean;
  isApproved?: boolean;
  isAccepted?: boolean;
  units?: string[];
  users?: string[];
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

export default function getAllLeaveRequest({
  filter,
  encodedString,
}: {
  filter?: RequestProps;
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
    `${endpoint}/requestForLeave?${encodeString}`,
    fetcher
  );

  return {
    requests: data,
    isLoading,
    isError: error,
    mutate,
  };
}
