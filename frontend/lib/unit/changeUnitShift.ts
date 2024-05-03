import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export type Props = {
  id: string;
  shifts: {};
};
export default async function changeUnitShift({ id, shifts }: Props) {
  const url = `${endpoint}/unit/${id}/shift`;

  const data = {
    shifts: shifts,
  };

  const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, data, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return res;
}
