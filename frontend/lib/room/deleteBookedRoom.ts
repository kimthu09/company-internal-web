import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export default async function deleteBookedRoom({ id }: { id: string }) {
  const url = `${endpoint}/meeting_room/books/${id}`;

  const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .delete(url, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return res;
}
