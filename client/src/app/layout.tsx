import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import Navbar from "@/components/navbar";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { getUser } from "@/lib/getUser";
import Footer from "@/components/footer";
import SocketProvider from "@/components/SocketProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Friendsy",
  description: "A social media app built with Next.js, React, and TypeScript",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased bg-background`}>
        <QueryProvider>
          <StoreProvider>
            <SocketProvider>
              <AuthProvider user={user}>
                <Navbar />

                <div className="pt-20">{children}</div>
                <Footer />
              </AuthProvider>
            </SocketProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
