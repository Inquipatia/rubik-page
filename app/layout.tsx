import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Script src="/three.r134.min.js" strategy="afterInteractive" />
        <Script src="/vanta.waves.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}