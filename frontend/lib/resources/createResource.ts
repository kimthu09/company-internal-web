import { apiKey, endpoint } from "@/constants";
import axios from "axios";

export default async function createResource({ name }: { name: string }) {
  const url = `${endpoint}/resource`;
  // const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, { name: name }, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);

      return error;
    });
  return res;
}
