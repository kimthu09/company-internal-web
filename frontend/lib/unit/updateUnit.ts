import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export type Props = {
  id: string;
  name?: string;
  managerId?: number;
  features?: number[];
};
export default async function updateUnit({
  id,
  name,
  managerId,
  features,
}: Props) {
  const url = `${endpoint}/unit/${id}`;

  const data = {
    ...(managerId && { managerId: managerId }),
    ...(name && { name: name.trim() }),
    ...(features && { features: features }),
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
