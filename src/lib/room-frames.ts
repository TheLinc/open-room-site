import type { StaticImageData } from "next/image";
import type { BeatId } from "@/lib/copy";
import F1 from "@/assets/room/F1.webp";
import F4 from "@/assets/room/F4.webp";
import S1 from "@/assets/room/S1.webp";
import S2 from "@/assets/room/S2.webp";
import S4 from "@/assets/room/S4.webp";

// The rest frame: video poster, reduced-motion fallback, final call to action.
export const restFrame: StaticImageData = F1;

export const sectionFrames: Record<BeatId, StaticImageData> = {
  name: S1,
  team: S2,
  command: F4,
  local: S4,
};

// Where each named agent's head is in the square crop, as fractions of its
// width and height. Status labels hang just above these points.
export const agentSpots: Record<string, { x: number; y: number }> = {
  Juno: { x: 0.305, y: 0.42 },
  Atlas: { x: 0.515, y: 0.35 },
};
