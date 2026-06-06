import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { GlobalUI } from "@/components/ui/GlobalUI";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HUKANZEN",
  description: "Pomodoro Timer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${inter.variable} antialiased`}
      >
        <UserProvider>
          <GlobalUI />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
