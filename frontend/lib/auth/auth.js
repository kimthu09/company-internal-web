import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import axios from "axios";
import { endpoint } from "@/constants";
const login = async (credentials) => {
  const headers = {
    accept: "*/*",
    "Content-Type": "application/json"
  };
  let responseData;
  try {
    const response = await axios.post(endpoint + "/auth/authenticate", {
      email: credentials.email,
      password: credentials.password,
    }, { headers: headers });

    if (response) {
      responseData = response.data;
    }
  } catch (error) {
    console.error("Error:", error);
    responseData = error;
  }

  if (
    responseData.hasOwnProperty("response") &&
    responseData.response.hasOwnProperty("data") &&
    responseData.response.data.hasOwnProperty("message") &&
    responseData.response.data.hasOwnProperty("status")
  ) {
    return null;
  } else if (
    responseData.hasOwnProperty("code") &&
    responseData.code.includes("ERR")
  ) {
    return null;
  } else {

    const { token } = responseData;

    const user = await axios
      .get(endpoint + "/user", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return error.response.data;
      });
    user.token = token;
    return user;
  }
};

export const {
  handlers: { POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
});
