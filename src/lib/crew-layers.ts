import type { Sprite } from "@/lib/crew-sprites";

export interface Cell {
  x: number;
  y: number;
}

export interface Run {
  x: number;
  y: number;
  w: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteLayers {
  /** Wood and seat cells with their palette character. */
  furniture: (Run & { ch: string })[];
  /** The agent's body minus the hands. */
  body: Run[];
  /** Left and right forearms at desk height; they take turns rising to type. */
  handL: Run[];
  handR: Run[];
  /** The monitor's screen, one rect, recoloured when the agent is working. */
  screen: Box;
  /** The head: the body above the desk, where eyes appear when it turns. */
  head: Box;
  /** Row index of the desk top. */
  deskRow: number;
}

/** Merge horizontally adjacent cells into runs, one rect each. */
export function runsOf(cells: Cell[]): Run[] {
  const sorted = [...cells].sort((a, b) => a.y - b.y || a.x - b.x);
  const runs: Run[] = [];
  for (const c of sorted) {
    const last = runs[runs.length - 1];
    if (last && last.y === c.y && last.x + last.w === c.x) last.w++;
    else runs.push({ x: c.x, y: c.y, w: 1 });
  }
  return runs;
}

function bbox(cells: Cell[]): Box {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const c of cells) {
    x0 = Math.min(x0, c.x);
    y0 = Math.min(y0, c.y);
    x1 = Math.max(x1, c.x + 1);
    y1 = Math.max(y1, c.y + 1);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Splits a traced sprite into the parts the animation moves or recolours.
export function layersOf(sprite: Sprite): SpriteLayers {
  const rows = sprite.rows;
  const cells = (pred: (ch: string, x: number, y: number) => boolean): Cell[] => {
    const out: Cell[] = [];
    rows.forEach((line, y) => {
      for (let x = 0; x < line.length; x++) if (pred(line[x], x, y)) out.push({ x, y });
    });
    return out;
  };

  // The desk top is the first row where wood reaches both edges of the slot.
  const deskRow = rows.findIndex((line) => line.indexOf("k") <= 2 && line.lastIndexOf("k") >= line.length - 3);

  // The screen is the pale block above the desk; the monitor frame's top row
  // and the desk row bound it. Pale cells elsewhere are tracing noise.
  const paleAbove = cells((ch, _x, y) => ch === "S" && y < deskRow - 4);
  const screen = bbox(paleAbove);

  // Hands: body cells at desk height outside the chair. The chair is the
  // run of seat and wood around the centre column on the row above the desk.
  const centre = Math.floor(sprite.width / 2);
  const chairLine = rows[deskRow - 1];
  let chairL = centre;
  let chairR = centre;
  while (chairL > 0 && "kts".includes(chairLine[chairL - 1])) chairL--;
  while (chairR < sprite.width - 1 && "kts".includes(chairLine[chairR + 1])) chairR++;
  const isHandRow = (y: number) => y >= deskRow - 2 && y <= deskRow;
  const handL = cells((ch, x, y) => ch === "X" && isHandRow(y) && x < chairL);
  const handR = cells((ch, x, y) => ch === "X" && isHandRow(y) && x > chairR);
  const hand = new Set([...handL, ...handR].map((c) => `${c.x},${c.y}`));

  const body = cells((ch, x, y) => ch === "X" && !hand.has(`${x},${y}`));
  const head = bbox(body.filter((c) => c.y < deskRow - 4));

  const furniture: (Run & { ch: string })[] = [];
  for (const ch of ["k", "t", "s"]) {
    for (const run of runsOf(cells((c) => c === ch))) furniture.push({ ...run, ch });
  }

  return {
    furniture,
    body: runsOf(body),
    handL: runsOf(handL),
    handR: runsOf(handR),
    screen,
    head,
    deskRow,
  };
}
