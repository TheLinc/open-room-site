"use client";

import { forwardRef, type CSSProperties } from "react";

// The headline's verb, set in white inside an ink pill with level bars after
// it: the one pixel-style element outside the characters. The word reads as
// part of the sentence; the bars say it is spoken. They murmur in teal at
// rest, and while a line is being said they rise and take the colour of the
// agent it is addressed to, the same colour the ripple carries down to that
// agent's desk.
export const VoicePill = forwardRef<
  HTMLSpanElement,
  { word: string; speaking: boolean; color?: string | null }
>(function VoicePill({ word, speaking, color }, ref) {
  return (
    <span
      ref={ref}
      className={`voice-pill relative top-[-0.04em] mr-[0.04em] inline-flex h-[0.86em] items-center gap-[0.13em] rounded-full bg-ink pl-[0.2em] pr-[0.24em] align-middle text-white ${speaking ? "is-speaking" : ""}`}
      style={color ? ({ "--voice": color } as CSSProperties) : undefined}
    >
      <span className="leading-none">{word}</span>
      <span
        className="inline-flex items-center gap-[0.05em] pt-[0.02em]"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <i
            key={i}
            className="block h-[0.26em] w-[0.055em] rounded-[0.03em] bg-[var(--voice)] transition-colors duration-300"
            style={{ "--n": i } as CSSProperties}
          />
        ))}
      </span>
    </span>
  );
});
