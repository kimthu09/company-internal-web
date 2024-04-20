import { apiKey, endpoint } from "@/constants";
import axios from "axios";

export default async function createUnit({
  unit,
}: {
  unit: {
    name: string;
    features: number[];
  };
}) {
  const url = `${endpoint}/unit`;
  // const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, unit, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);

      return error;
    });
  return res;
}
