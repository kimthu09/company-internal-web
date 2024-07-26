import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        const tokenExpiresAt = new Date(token.id.token.expired + " GMT+0");
        const currentTime = new Date();
        if (currentTime > tokenExpiresAt) {
          session.user = null;
          return session;
        }
        session.user = token.id;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const user = auth?.user;

      const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
      const isOnResetPasswordPage =
        request.nextUrl?.pathname.startsWith("/reset-password");

      if (user && (isOnLoginPage || isOnResetPasswordPage)) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }

      if (!user && !isOnLoginPage && !isOnResetPasswordPage) {
        return false;
      }

      return true;
    },
  },
};
