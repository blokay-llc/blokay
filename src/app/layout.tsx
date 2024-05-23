import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@blokay/react/css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blokay",
  description: "Create dashboards and backoffices in seconds",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bl-dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
