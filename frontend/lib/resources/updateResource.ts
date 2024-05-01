import { apiKey, endpoint } from "@/constants";
import axios from "axios";

export default async function updateResource({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const url = `${endpoint}/resource/${id}`;

  const data = {
    name: name,
  };

  // const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .put(url, data, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return res;
}
