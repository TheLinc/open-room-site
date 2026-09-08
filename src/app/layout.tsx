import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { copy } from "@/lib/copy";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openroom.dev"),
  title: copy.siteName,
  description: copy.description,
  openGraph: {
    title: copy.headline,
    description: copy.description,
    url: "https://openroom.dev",
    siteName: copy.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.headline,
    description: copy.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
