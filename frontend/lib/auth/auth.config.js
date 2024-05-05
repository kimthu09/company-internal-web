export const authConfig = {
  pages: {
    signIn: "/login",
    resetPassword: "/reset-password",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      // console.log(user)
      if (user) {
        token.id = user;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user = token.id;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const user = auth?.user;

      const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
      const isOnResetPasswordPage =
        request.nextUrl?.pathname.startsWith("/reset-password");

      if (user && isOnLoginPage) {
        return Response.redirect(new URL("/", request.nextUrl));
      }
      if (user && isOnResetPasswordPage) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isOnLoginPage) {
        return true;
      }
      if (isOnResetPasswordPage) {
        return true;
      }
      if (!user && !isOnLoginPage && !isOnResetPasswordPage) {
        return false;
      }
      return true;
    },
  },
};