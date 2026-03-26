import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rubik Page",
  description: "Rubik Creaciones interactive landing",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}