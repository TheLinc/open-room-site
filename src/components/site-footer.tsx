import { copy } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-10 text-sm text-zinc-500">
      <span>{copy.siteName}</span>
      <a
        href={copy.footer.githubUrl}
        className="underline-offset-4 hover:text-zinc-300 hover:underline"
        rel="noopener"
      >
        {copy.footer.githubLabel}
      </a>
    </footer>
  );
}
