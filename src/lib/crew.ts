/**
 * The five agents on the landing page, in desk order left to right. Colours
 * are the ones traced from the desk-row still so sprites, screens and pills
 * all agree.
 */

export type CrewId = "clawd" | "bit" | "terminal" | "block" | "loop";

export interface CrewMember {
  id: CrewId;
  name: string;
  /** Body colour, also used for the lit screen, pills and bubbles. */
  color: string;
  /** Idle screen tint. */
  screen: string;
}

export const crew: readonly CrewMember[] = [
  { id: "clawd", name: "Clawd", color: "#d87858", screen: "#f8e2d0" },
  { id: "bit", name: "Bit", color: "#288888", screen: "#d0f0f0" },
  { id: "terminal", name: "Terminal", color: "#488848", screen: "#d8f8c8" },
  { id: "block", name: "Block", color: "#cc2828", screen: "#f8c8c8" },
  { id: "loop", name: "Loop", color: "#682c78", screen: "#e8d0f0" },
];

export const crewById: Record<CrewId, CrewMember> = Object.fromEntries(
  crew.map((c) => [c.id, c]),
) as Record<CrewId, CrewMember>;
