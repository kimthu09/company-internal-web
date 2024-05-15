import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      phone: string;
      address: string;
      dob: string;
      male: boolean;
      userIdentity: string;
      unit: {
        id: number;
        code: string;
        name: string;
      };
      token: string;
    } & DefaultSession["user"];
  }
  interface User {
    phone: string;
    address: string;
    dob: string;
    male: boolean;
    userIdentity: string;
    unit: {
      id: number;
      code: string;
      name: string;
    };
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface DefaultJWT {
    user: User;
  }
}
