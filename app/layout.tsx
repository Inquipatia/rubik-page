import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rubik Hero",
  description: "Hero section with a cube visual",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
