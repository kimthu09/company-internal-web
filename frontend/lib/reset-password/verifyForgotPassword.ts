import { endpoint } from "@/constants";
import axios from "axios";

export default async function verifyForgotPassword({
  forgetPasswordToken,
  password
}: {
  forgetPasswordToken: string,
  password: string;
}) {
  const url = `${endpoint}/auth/reset_password/${forgetPasswordToken}`;
  const data = {
    password: password
  };

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json"
  };

  const res = axios
    .post(url, data, { headers: headers })
    .then((response) => {
      if (response) return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.data;
    });
  return res;
}
