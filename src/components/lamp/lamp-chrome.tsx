import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import logo from "@/assets/brand/logo.png";

// Header and footer for the paper-coloured pages. The logo asset is light
// grey for the dark site, so it is darkened here rather than re-exported.
export function LampHeader() {
  return (
    <header className="lamp-header">
      <Link href="/" className="lamp-brand" aria-label={copy.siteName}>
        <Image
          src={logo}
          alt=""
          width={14}
          height={35}
          className="lamp-logo"
          preload
        />
        <span>{copy.siteName}</span>
      </Link>
      <nav className="lamp-nav" aria-label="Site">
        <Link href="/styling">Styling</Link>
        <a href={copy.footer.githubUrl} rel="noopener">
          GitHub
        </a>
      </nav>
    </header>
  );
}

export function LampFooter() {
  return (
    <footer className="lamp-footer">
      <span>{copy.siteName}</span>
      <a href={copy.footer.githubUrl} rel="noopener">
        {copy.footer.githubLabel}
      </a>
    </footer>
  );
}
