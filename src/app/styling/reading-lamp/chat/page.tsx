import type { Metadata } from "next";
import { LampPage } from "@/components/lamp/lamp-page";
import { copy } from "@/lib/copy";
import "../lamp.css";

export const metadata: Metadata = {
  title: `${copy.siteName} · Reading lamp, chat`,
  description: copy.description,
  robots: { index: false, follow: false },
};

export default function ReadingLampChatPage() {
  return <LampPage flow="chat" />;
}
