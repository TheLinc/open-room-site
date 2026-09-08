"use client";

import { forwardRef, type CSSProperties } from "react";

// The first word of the headline: your voice, as level bars in an ink pill.
// The word itself stays for screen readers and search engines. The bars
// murmur at rest and rise while something is being said; the rise is a
// transition on --amp so it never jumps.
export const VoicePill = forwardRef<
  HTMLSpanElement,
  { word: string; speaking: boolean }
>(function VoicePill({ word, speaking }, ref) {
  return (
    <span ref={ref} className={`lamp-voice ${speaking ? "is-speaking" : ""}`}>
      <span className="sr-only">{word}</span>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <i key={i} aria-hidden="true" style={{ "--n": i } as CSSProperties} />
      ))}
    </span>
  );
});
