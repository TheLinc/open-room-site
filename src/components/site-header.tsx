import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import logo from "@/assets/brand/logo.png";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center px-6 py-5">
      <Link href="/" className="flex items-center gap-2.5" aria-label={copy.siteName}>
        <Image src={logo} alt="" width={14} height={35} className="h-7 w-auto" preload />
        <span className="text-base font-medium tracking-tight text-zinc-100">{copy.siteName}</span>
      </Link>
    </header>
  );
}
