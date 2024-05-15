import { endpoint } from "@/constants";
import axios from "axios";
import { getApiKey } from "../auth/action";

export type Props = {
  phone?: string;
  address?: string;
  image?: string;
};
export default async function updateProfile({ address, image, phone }: Props) {
  const url = `${endpoint}/user/info`;

  const data = {
    ...(address && { address: address }),
    ...(image && { image: image }),
    ...(phone && { phone: phone }),
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
