import { apiKey, endpoint } from "@/constants";
import axios from "axios";

export default async function createRoom({
  name,
  location,
}: {
  name: string;
  location: string;
}) {
  const url = `${endpoint}/meeting_room`;
  // const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // Add other headers as needed
  };
  const data = { name: name.trim(), ...(location && { location: location }) };
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
