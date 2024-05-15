import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import { LoadingProvider } from "@/hooks/loading-context";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth/auth";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Companion",
  description: "Trang nội bộ công ty",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthented = await auth().then((res: any) => res?.user);
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.className} flex overflow-y-hidden h-full`}>
        <SessionProvider>
          <LoadingProvider>
            {isAuthented ? (
              <>
                <Sidebar />
                <main className="flex flex-1 bg-[#eef6f7]">
                  <div className="flex w-full flex-col overflow-y-hidden">
                    <Header />
                    <HeaderMobile />
                    <div className="md:p-12 p-4 overflow-auto ">{children}</div>
                    <Toaster />
                  </div>
                </main>
              </>
            ) : (
              <main className="flex flex-1">
                {children}
                <Toaster />
              </main>
            )}
          </LoadingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
