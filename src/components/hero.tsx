"use client";

import { AppWindow } from "@/components/app-window";
import { CrewDesks, DESKS_H, DESKS_W } from "@/components/crew-desks";
import { DownloadButton, SourceButton } from "@/components/download-button";
import { HeroField } from "@/components/hero-field";
import { VoicePill } from "@/components/voice-pill";
import { copy } from "@/lib/copy";
import { crewById } from "@/lib/crew";
import { heroStateAt, heroStill } from "@/lib/hero-script";
import { useTimeline } from "@/lib/use-timeline";

// The first viewport: centred copy over the pixel field, then the app window
// with the crew perched on its top edge. One clock drives the pill, the
// desks and the thread; the field behind them is its own quiet thing.
export function Hero() {
  const { state, reduced } = useTimeline(heroStateAt, heroStill);
  const [verb, ...rest] = copy.hero.headline.split(" ");

  return (
    <section id="top" className="relative overflow-hidden pt-8 md:pt-8">
      <div className="absolute inset-x-0 top-0 h-[680px]" aria-hidden="true">
        <HeroField still={reduced} />
      </div>

      <div className="relative mx-auto flex max-w-[1120px] flex-col items-center px-6 text-center">
        <h1 className="max-w-[21ch] text-balance text-[40px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[52px] md:text-[64px]">
          <VoicePill
            word={verb}
            speaking={state.speaking}
            color={state.speakingTo ? crewById[state.speakingTo].color : null}
          />{" "}
          {rest.join(" ")}
        </h1>
        <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.5] text-muted md:text-[19px]">
          {copy.hero.lead}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <DownloadButton size="lg" />
          <SourceButton />
        </div>
        <p className="mt-3 font-mono text-[13px] text-muted">
          {copy.hero.under}
        </p>
      </div>

      <div className="relative mx-auto mt-[96px] w-full max-w-[1040px] px-4 md:mt-[116px] md:px-6">
        <div
          className="absolute bottom-[calc(100%-10px)] left-1/2 z-[2] w-[min(560px,80%)] -translate-x-1/2"
          style={{
            aspectRatio: `${DESKS_W} / ${DESKS_H}`,
            filter: "drop-shadow(0 6px 0 rgb(0 0 0 / 0.06))",
          }}
        >
          <CrewDesks
            desks={state.desks}
            glancing={state.glancing}
            className="block h-full w-full"
          />
        </div>
        <div role="img" aria-label={copy.hero.narration}>
          <div aria-hidden="true">
            <AppWindow state={state} />
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-xs text-muted">
          {copy.hero.caption}
        </p>
      </div>
    </section>
  );
}
