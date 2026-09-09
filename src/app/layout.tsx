import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { copy, links } from "@/lib/copy";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(links.site),
  title: `${copy.siteName}. Talk to your Claude Code agents.`,
  description: copy.description,
  openGraph: {
    title: copy.hero.headline,
    description: copy.description,
    url: links.site,
    siteName: copy.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.hero.headline,
    description: copy.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
