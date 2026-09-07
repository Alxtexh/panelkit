import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serenity",
  description: "Serenity is a meditation app that helps you meditate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
