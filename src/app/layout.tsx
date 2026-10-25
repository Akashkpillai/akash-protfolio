import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { profile } from "@/content/profile";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} | Portfolio`,
  description: profile.headline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable}`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
