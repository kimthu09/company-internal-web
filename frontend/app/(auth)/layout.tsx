import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/hooks/loading-context";
import { Toaster } from "@/components/ui/toaster";

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
  return (
    <html lang="en" className="h-full">
      <body className={`${roboto.className} flex overflow-y-hidden h-full`}>
        <LoadingProvider>
          <main className="flex flex-1">
            {children}
            <Toaster />
          </main>
        </LoadingProvider>
      </body>
    </html>
  );
}
