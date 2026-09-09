"use client";

import { forwardRef, type CSSProperties } from "react";

// The headline's verb, as level bars in an ink pill: the one pixel-style
// element outside the characters. The word stays for screen readers and
// search. Bars murmur in teal at rest; while a line is being said they rise
// and take the colour of the agent it is addressed to, the same colour the
// ripple carries down to that agent's desk.
export const VoicePill = forwardRef<
  HTMLSpanElement,
  { word: string; speaking: boolean; color?: string | null }
>(function VoicePill({ word, speaking, color }, ref) {
  return (
    <span
      ref={ref}
      className={`voice-pill relative top-[-0.03em] mr-[0.06em] inline-flex h-[0.72em] items-center justify-center gap-[0.055em] rounded-full bg-ink px-[0.22em] align-middle ${speaking ? "is-speaking" : ""}`}
      style={color ? ({ "--voice": color } as CSSProperties) : undefined}
    >
      <span className="sr-only">{word}</span>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <i
          key={i}
          aria-hidden="true"
          className="block h-[0.3em] w-[0.06em] rounded-[0.03em] bg-[var(--voice)] transition-colors duration-300"
          style={{ "--n": i } as CSSProperties}
        />
      ))}
    </span>
  );
});
