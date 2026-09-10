"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Pixel Blast pulls Three.js in, so it loads after the page is interactive
// and never renders on the server. It is decoration: under reduced motion,
// or without WebGL, the hero simply has a plain ground.
const PixelBlast = dynamic(() => import("@/components/pixel-blast"), {
  ssr: false,
});

// A zinc a few steps off the ground, so the lattice reads as depth in the
// surface and the voice pill stays the only teal in the first viewport.
const FIELD_COLOR = "#d4d4d8";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroField({ still }: { still: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (still || !hasWebGL()) return;
    // A short deferral so hydration and the hero script settle first.
    const timer = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(timer);
  }, [still]);

  if (!ready) return null;
  return (
    <div
      className="h-full w-full"
      style={{
        // Two masks multiply: the bottom fade that ends the field before the
        // window, and a soft clearing behind the copy block so the lead and
        // under-line sit on thinner lattice. The headline's pill still
        // travels through the field; it just does not fight the paragraph.
        maskImage: [
          "linear-gradient(to bottom, black 55%, transparent 96%)",
          "radial-gradient(ellipse 34% 26% at 50% 34%, rgb(0 0 0 / 0.35) 0%, rgb(0 0 0 / 0.35) 55%, black 100%)",
        ].join(", "),
        WebkitMaskImage: [
          "linear-gradient(to bottom, black 55%, transparent 96%)",
          "radial-gradient(ellipse 34% 26% at 50% 34%, rgb(0 0 0 / 0.35) 0%, rgb(0 0 0 / 0.35) 55%, black 100%)",
        ].join(", "),
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        animation: "field-in 900ms ease-out both",
      }}
    >
      <PixelBlast
        variant="square"
        pixelSize={6}
        color={FIELD_COLOR}
        patternScale={3}
        patternDensity={0.8}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        speed={0.6}
        edgeFade={0.25}
        transparent
      />
    </div>
  );
}
