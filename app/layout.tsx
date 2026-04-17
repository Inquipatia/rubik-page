import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Rubik Creaciones",
  description: "Rubik Creaciones interactive landing",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/three.r134.min.js" strategy="afterInteractive" />
        <Script src="/vanta.waves.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}