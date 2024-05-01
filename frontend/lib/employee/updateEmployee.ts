import { apiKey, endpoint } from "@/constants";
import axios from "axios";

export type Props = {
  id: string;
  name?: string;
  phone?: string;
  dob?: string;
  address?: string;
  image?: string;
  male?: boolean;
  unit?: number;
};
export default async function updateEmployee({
  id,
  name,
  address,
  image,
  dob,
  phone,
  male,
  unit,
}: Props) {
  const url = `${endpoint}/staff/${id}`;

  const data = {
    ...(address && { address: address }),
    ...(image && { image: image }),
    ...(name && { name: name.trim() }),
    ...(phone && { phone: phone }),
    ...(dob && { dob: dob }),
    ...(male && { male: male }),
    ...(unit && { unit: unit }),
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
