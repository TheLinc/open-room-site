import { links } from "@/lib/copy";

const repo = links.github.replace("https://github.com/", "");
const headers = { Accept: "application/vnd.github+json" };

/** The repo's star count, fetched at render and cached for an hour. Null when
 *  GitHub is unreachable, so the page never shows a made-up number. */
export async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export interface Release {
  draft: boolean;
  assets: { name: string; browser_download_url: string }[];
}

/** Picks the Windows installer from the newest published release. GitHub's
 *  own "latest" redirect skips pre-releases, which is all the app has while
 *  it is 0.x, so this reads the full list instead. */
export function windowsInstaller(releases: Release[]): string | null {
  for (const r of releases) {
    if (r.draft) continue;
    const asset = r.assets.find((a) => /-setup\.exe$/i.test(a.name));
    if (asset) return asset.browser_download_url;
  }
  return null;
}

/** Where the download button goes: the newest Windows installer, or the
 *  releases list when GitHub can't be asked. Cached for an hour. */
export async function getDownloadUrl(): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=10`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return links.releases;
    const data = (await res.json()) as Release[];
    return windowsInstaller(data) ?? links.releases;
  } catch {
    return links.releases;
  }
}

export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k)}k`;
}
