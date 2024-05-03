import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export default async function markAllSeen() {
  const url = `${endpoint}/notification/seen`;

  const token = await getApiKey();
  const headers = {
    accept: "*/*",
    Authorization: `Bearer ${token}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, {}, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return res;
}
