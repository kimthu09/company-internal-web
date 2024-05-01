import { apiKey, endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";

export type BookingProps = {
  createdBy: string;
  resource: string;
  from: string;
  to: string;
};
export const fetcher = (url: string) => {
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
        data: json.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};

export default function getAllResourceBooking({
  filter,
}: {
  filter?: BookingProps;
}) {
  let encodeString = "";
  if (filter) {
    encodeString = Object.entries(filter)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join("&");
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/resource/books?${encodeString}`,
    fetcher
  );

  return {
    bookings: data,
    isLoading,
    isError: error,
    mutate,
  };
}