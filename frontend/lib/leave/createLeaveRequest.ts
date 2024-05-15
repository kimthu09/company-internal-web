import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

type CreateLeaveProps = {
  fromDate: string;
  toDate: string;
  fromShiftType: string;
  toShiftType: string;
  note: string;
};
export default async function createLeave({
  data,
}: {
  data: CreateLeaveProps;
}) {
  const url = `${endpoint}/requestForLeave`;
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
