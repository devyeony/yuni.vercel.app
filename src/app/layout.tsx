import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeonhee Kim",
  description: "Building software with a love for cats and the cosmos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
