import type { Metadata } from "next";
import { Outfit, Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "EventFDR - Discover & Register for Amazing Events",
  description: "Find concerts, conferences, workshops, and more. Register with ease and never miss out on unforgettable experiences.",
  keywords: "events, conferences, concerts, workshops, registration, tickets, booking",
  authors: [{ name: "EventFDR" }],
  openGraph: {
    title: "EventFDR - Discover & Register for Amazing Events",
    description: "Find concerts, conferences, workshops, and more. Register with ease and never miss out on unforgettable experiences.",
    type: "website",
    url: "https://eventfdr.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventFDR - Discover & Register for Amazing Events",
    description: "Find concerts, conferences, workshops, and more. Register with ease and never miss out on unforgettable experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <div className="app">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
