import { apiKey, endpoint } from "@/constants";
import { ShiftType } from "@/types";
import axios from "axios";

type UnbookProps = {
  from: {
    date: string;
    shiftType: string;
  };
  to: {
    date: string;
    shiftType: string;
  };
};
export default async function getUnbookResources({
  data,
}: {
  data: UnbookProps;
}) {
  const url = `${endpoint}/resource/books/day_range/unbook`;
  // const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, data, { headers: headers })
    .then((response) => {
      if (response) {
        return response.data;
      }
    })
    .catch((error) => {
      console.error("Error:", error);

      return error;
    });
  return res;
}
