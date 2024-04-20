import axios from "axios";
import { apiKey, endpoint } from "@/constants";

export const imageUpload = async (formData: FormData) => {
  // const token = await getApiKey();

  const res = axios
    .post(`${endpoint}/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
  return res;
};
