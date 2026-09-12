import Image from "next/image";
import { copy, links } from "@/lib/copy";
import { formatStars } from "@/lib/github";
import { DownloadButton } from "@/components/download-button";
import { GitHubIcon, StarIcon } from "@/components/icons";
import logo from "@/assets/brand/logo.png";

export function SiteHeader({
  stars,
  download,
}: {
  stars: number | null;
  download: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ground/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-6">
        <a
          href="#top"
          className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em]"
        >
          <Image
            src={logo}
            alt=""
            width={12}
            height={22}
            className="brightness-0"
            style={{ height: 22, width: "auto" }}
            priority
          />
          {copy.siteName}
        </a>
        <nav
          className="flex items-center gap-5 text-sm text-ink-2"
          aria-label="Site"
        >
          {copy.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden hover:text-ink sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a
            href={links.github}
            className="hidden items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-[13px] text-ink hover:bg-ground sm:inline-flex"
            aria-label={
              stars === null
                ? "Open Room on GitHub"
                : `${stars} stars on GitHub`
            }
          >
            <GitHubIcon size={14} />
            {stars ? (
              <>
                <StarIcon size={12} className="text-muted" />
                <span className="tabular-nums">{formatStars(stars)}</span>
              </>
            ) : (
              "GitHub"
            )}
          </a>
          {download ? (
            <DownloadButton href={download} />
          ) : (
            <a
              href="#notify"
              className="inline-flex h-9 items-center whitespace-nowrap rounded-lg bg-ink px-3.5 text-sm font-medium text-white transition-colors hover:bg-ink-2"
            >
              {copy.form.header}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
