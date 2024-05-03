import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export default async function createNotification({
  data,
}: {
  data: {
    title: string;
    description: string;
    receivers: number[];
  };
}) {
  const dataToPost = {
    title: data.title,
    description: data.description,
    ...(data.receivers &&
      data.receivers.length > 0 && { receivers: data.receivers }),
  };
  const url = `${endpoint}/notification`;
  const token = await getApiKey();
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // Add other headers as needed
  };

  // Make a POST request with headers
  const res = axios
    .post(url, dataToPost, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);

      return error;
    });
  return res;
}
