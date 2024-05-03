import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type BookingProps = {
  createdBy?: string;
  meetingRoom?: string;
  from?: string;
  to?: string;
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
        data: json.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
};

export default function getAllRoomBooking({
  encodedString,
}: {
  encodedString?: string;
}) {
  let encodeString = "";
  if (encodedString) {
    encodeString = encodeString.concat("&").concat(encodedString);
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/meeting_room/books?${encodeString}`,
    fetcher
  );

  return {
    bookings: data,
    isLoading,
    isError: error,
    mutate,
  };
}
