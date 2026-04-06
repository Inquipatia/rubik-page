import type { Metadata } from "next";
import "./globals.css";
import FloatingSocialOrb from "@/app/components/scenes/floating-social-orb";

export const metadata: Metadata = {
  title: "Rubik Creaciones",
  description: "Rubik Creaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingSocialOrb />
      </body>
    </html>
  );
}