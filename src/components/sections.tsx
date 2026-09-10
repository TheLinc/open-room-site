import { CrewFace } from "@/components/crew-face";
import { DownloadButton } from "@/components/download-button";
import { ArrowIcon, GitHubIcon, StarIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { CrewDesks, DESKS_H, DESKS_W } from "@/components/crew-desks";
import { crew } from "@/lib/crew";
import { copy, links } from "@/lib/copy";
import { formatStars } from "@/lib/github";

export function OpenSource({ stars }: { stars: number | null }) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-32 md:pt-40">
      <Reveal className="grid gap-8 border-t border-line pt-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
          {copy.openSource.title}
        </h2>
        <div>
          <p className="text-[17px] leading-[1.55] text-ink-2">
            {copy.openSource.body}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={links.github}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-card px-4 text-[14px] font-medium hover:bg-ground"
            >
              <GitHubIcon size={15} />
              {copy.openSource.repo}
              {stars ? (
                <span className="inline-flex items-center gap-1 border-l border-line pl-2.5 text-muted">
                  <StarIcon size={12} />
                  <span className="tabular-nums">{formatStars(stars)}</span>
                </span>
              ) : null}
            </a>
            <span className="text-[14px] text-muted">
              {copy.openSource.licence}
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const allWorking = {
  clawd: "working",
  bit: "working",
  terminal: "working",
  block: "working",
  loop: "working",
} as const;

export function Safety() {
  return (
    <section className="relative mt-40 bg-night text-white md:mt-48">
      <div
        className="pointer-events-none absolute bottom-full right-[6%] w-[min(420px,70%)] md:right-[10%]"
        style={{ aspectRatio: `${DESKS_W} / ${DESKS_H}` }}
        aria-hidden="true"
      >
        <CrewDesks
          desks={allWorking}
          glancing={null}
          className="block h-full w-full"
        />
      </div>
      <div className="mx-auto max-w-[1120px] px-6 py-24 md:py-32">
        <Reveal className="max-w-[44ch]">
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
            {copy.safety.title}
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-night-muted">
            {copy.safety.body}
          </p>
        </Reveal>
        <dl className="mt-16 grid gap-px overflow-hidden rounded-panel border border-night-line bg-night-line sm:grid-cols-2 lg:grid-cols-4">
          {copy.safety.facts.map((f, i) => (
            <Reveal key={f.key} delay={i * 70} className="bg-night-card p-6">
              <dt className="text-[13px] font-medium text-[#7fd1d1]">
                {f.key}
              </dt>
              <dd className="mt-3 text-[15px] leading-[1.5] text-zinc-200">
                {f.text}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function GetStarted({ download }: { download: string }) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-32 md:pt-40">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <Reveal>
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
            {copy.start.title}
          </h2>
          <div className="mt-8">
            <DownloadButton size="lg" href={download} />
          </div>
          <p className="mt-4 text-[14px] text-muted">{copy.start.platforms}</p>
        </Reveal>
        <ol className="grid">
          {copy.start.steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 80}
              className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-6 first:border-t-0"
            >
              <ArrowIcon size={16} className="mt-1.5 text-muted" />
              <div>
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-2">
                  {s.body}
                </p>
                {i === 2 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {crew.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card py-1 pl-1 pr-2.5 text-[12px]"
                      >
                        <CrewFace id={m.id} size={20} className="pixel" />
                        {m.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line md:mt-40">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.footer.licence}</p>
        <nav className="flex gap-5" aria-label="Footer">
          <a href={links.github} className="hover:text-ink">
            {copy.footer.github}
          </a>
          <a href={links.releases} className="hover:text-ink">
            {copy.footer.releases}
          </a>
        </nav>
      </div>
    </footer>
  );
}
