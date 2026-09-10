import { copy, links } from "@/lib/copy";
import { WindowsIcon } from "@/components/icons";

// The one filled button on the page. The page resolves the installer from
// GitHub at render, so a new release never needs a site change; without an
// answer it falls back to the releases list.
export function DownloadButton({
  href = links.releases,
  size = "md",
  className = "",
}: {
  href?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing = size === "lg" ? "h-11 px-5 text-[15px]" : "h-9 px-3.5 text-sm";
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-ink font-medium text-white transition-colors hover:bg-ink-2 ${sizing} ${className}`}
    >
      <WindowsIcon size={15} />
      {copy.hero.download}
    </a>
  );
}

export function SourceButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={links.github}
      className={`inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-card px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ground ${className}`}
    >
      {copy.hero.source}
    </a>
  );
}
