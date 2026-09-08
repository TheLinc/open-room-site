import type { CrewId } from "@/lib/crew";

/**
 * Front-facing mascots for avatars, drawn by hand from the crew reference.
 * X is the body, D the darker inner body, w an eye, "." empty.
 */
export type Face = {
  id: CrewId;
  width: number;
  height: number;
  rows: string[];
};

export const crewFaces: Face[] = [
  {
    id: "clawd",
    width: 12,
    height: 7,
    rows: [
      "X..XXXXXX..X",
      "XX.XwXXwX.XX",
      "XXXXXXXXXXXX",
      ".XXXXXXXXXX.",
      "..XXXXXXXX..",
      "..X.X..X.X..",
      "..X.X..X.X..",
    ],
  },
  {
    id: "bit",
    width: 8,
    height: 10,
    rows: [
      "X......X",
      ".X....X.",
      ".XXXXXX.",
      ".XwXXwX.",
      ".XXXXXX.",
      "..XXXX..",
      "..XXXX..",
      ".X.XX.X.",
      "...XX...",
      "..X..X..",
    ],
  },
  {
    id: "terminal",
    width: 10,
    height: 8,
    rows: [
      "XXXXXXXXXX",
      "XDDDDDDDDX",
      "XDDwDDwDDX",
      ".XDDDDDDX.",
      ".XDDDDDDX.",
      "..XDDDDX..",
      "..XXXXXX..",
      "...X..X...",
    ],
  },
  {
    id: "block",
    width: 8,
    height: 9,
    rows: [
      "XXXX....",
      "XwXw....",
      "XXXX....",
      "XXXX....",
      "XXXX....",
      "XXXXXXXX",
      "XXXXXXXX",
      "XXXXXXXX",
      ".XX..XX.",
    ],
  },
  {
    id: "loop",
    width: 8,
    height: 10,
    rows: [
      "..XXXXX.",
      ".XXwXXwX",
      "XXXXXXXX",
      "XXX.....",
      "XXX.....",
      "XXX.....",
      "XXXXXXXX",
      ".XXXXXXX",
      "..XXXXX.",
      "..X...X.",
    ],
  },
];

export const faceById: Record<CrewId, Face> = Object.fromEntries(
  crewFaces.map((f) => [f.id, f]),
) as Record<CrewId, Face>;
