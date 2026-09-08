import { describe, expect, test } from "vitest";
import {
  STREAM_SPEED,
  lineX,
  streamIsSpeaking,
} from "@/components/lamp/flow-stream";
import { TRAVEL_MS, lines } from "@/lib/crew-script";
import type { HeroGeometry } from "@/components/lamp/use-hero-geometry";

const geo: HeroGeometry = {
  width: 1152,
  pill: { x: 500, y: 120 },
  pillBox: null,
  headline: null,
  laneY: 560,
  targets: { bit: { x: 385, y: 660 }, block: { x: 775, y: 660 } },
};

describe("stream", () => {
  test("a line sits over its desk at the moment its agent starts working", () => {
    const bit = lines.find((l) => l.agent === "bit")!;
    expect(lineX(385, bit.at + TRAVEL_MS, bit.at + TRAVEL_MS)).toBe(385);
  });

  test("a line moves right at the stream speed", () => {
    expect(lineX(385, 3600, 2600)).toBeCloseTo(385 - STREAM_SPEED, 5);
  });

  test("the pill speaks while a line is entering the lane and not once it is in", () => {
    const bit = lines.find((l) => l.agent === "bit")!;
    const arrival = bit.at + TRAVEL_MS;
    const entering = arrival - ((385 - 20) / STREAM_SPEED) * 1000;
    expect(streamIsSpeaking(geo, entering)).toBe(true);
    expect(streamIsSpeaking(geo, arrival - 200)).toBe(false);
  });
});
