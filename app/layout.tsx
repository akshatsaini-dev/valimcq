// app/layout.tsx

import { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScrollWrapper from "../components/SmoothScrollWrapper";
import ScrollToBottom from "../components/ScrollToBottom";
import "./globals.css";

// Define local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the site
export const metadata: Metadata = {
  title: "ValiMCQ",
  description: "Validate your MCQs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap content in SmoothScrollWrapper */}
        {/* // <SmoothScrollWrapper>{children}</SmoothScrollWrapper>*/}
        {children}
        {/* Add the ScrollToBottom button */}
        <ScrollToBottom />
      </body>
    </html>
  );
}
