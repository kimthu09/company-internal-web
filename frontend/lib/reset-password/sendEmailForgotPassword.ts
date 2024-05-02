import { endpoint } from "@/constants";
import { getApiKey } from "../auth/action";
import axios from "axios";

export default async function sendEmailForgotPassword({
  email
}: {
  email: string;
}) {
  const url = `${endpoint}/auth/reset_password`;
  const data = {
    email: email
  };

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json"
  };

  const res = axios
    .post(url, data, { headers: headers })
    .then((response) => {
      console.log(response)
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
  return res;
}
