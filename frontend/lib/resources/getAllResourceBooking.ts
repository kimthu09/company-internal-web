import { endpoint } from "@/constants";
import axios from "axios";
import useSWR from "swr";
import { getApiKey } from "../auth/action";

export type BookingProps = {
  createdBy?: string;
  resource?: string;
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

export default function getAllResourceBooking({
  encodedString,
  isPersonal,
}: {
  encodedString?: string;
  isPersonal?: boolean;
}) {
  let encodeString = "";
  if (encodedString) {
    encodeString = encodeString.concat("&").concat(encodedString);
  }
  const { data, error, isLoading, mutate } = useSWR(
    `${endpoint}/resource/books${
      isPersonal ? "/personal" : ""
    }?${encodeString}`,
    fetcher
  );

  return {
    bookings: data,
    isLoading,
    isError: error,
    mutate,
  };
}
