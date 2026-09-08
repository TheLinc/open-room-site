// Traces the generated desk-row still into exact pixel sprites.
//
// The Nano Banana still is soft pixel art on a roughly 10 px grid. This
// finds the grid, samples the middle of every cell, snaps each sample to a
// small palette, and writes the result as rows of palette characters, one
// slot per agent, to src/lib/crew-sprites.ts. It also writes a crisp preview
// PNG next to the source so the trace can be checked by eye.
//
//   node scripts/trace-row.mjs [assets/higgsfield/keyframes/row/row-a.png]

import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const src = process.argv[2] ?? "assets/higgsfield/keyframes/row/row-a.png";
const out = "src/lib/crew-sprites.ts";
const preview = src.replace(/\.png$/, "-trace.png");

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = (x, y) => {
  const i = (y * W + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};

// Grid pitch and phase: the pitch is the strongest autocorrelation lag of
// the edge energy, the phase is where edges pile up modulo the pitch.
function energy(axis) {
  const n = axis === "x" ? W : H;
  const e = new Float64Array(n);
  for (let y = 0; y < H - 1; y++) {
    for (let x = 0; x < W - 1; x++) {
      const a = px(x, y);
      const b = axis === "x" ? px(x + 1, y) : px(x, y + 1);
      const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      e[axis === "x" ? x : y] += d;
    }
  }
  return e;
}
function pitchOf(e) {
  let best = 0;
  let bestLag = 0;
  for (let lag = 6; lag <= 40; lag++) {
    let s = 0;
    for (let i = 0; i < e.length - lag; i++) s += e[i] * e[i + lag];
    if (s > best) {
      best = s;
      bestLag = lag;
    }
  }
  return bestLag;
}
function phaseOf(e, pitch) {
  const bins = new Float64Array(pitch);
  for (let i = 0; i < e.length; i++) bins[i % pitch] += e[i];
  let best = 0;
  for (let i = 1; i < pitch; i++) if (bins[i] > bins[best]) best = i;
  // Edges sit between pixel i and i+1, so cells start at best+1.
  return (best + 1) % pitch;
}

const ex = energy("x");
const ey = energy("y");
const pitch = pitchOf(ex);
const pitchY = pitchOf(ey);
const phaseX = phaseOf(ex, pitch);
const phaseY = phaseOf(ey, pitchY);
const cols = Math.floor((W - phaseX) / pitch);
const rows = Math.floor((H - phaseY) / pitchY);
console.log(`grid ${cols}x${rows}, pitch ${pitch}x${pitchY}, phase ${phaseX},${phaseY}`);

// Sample the centre of every cell.
function sample(cx, cy) {
  const x0 = phaseX + cx * pitch;
  const y0 = phaseY + cy * pitchY;
  const acc = [0, 0, 0];
  let n = 0;
  for (let y = y0 + 3; y < y0 + pitchY - 3; y++) {
    for (let x = x0 + 3; x < x0 + pitch - 3; x++) {
      const p = px(x, y);
      acc[0] += p[0];
      acc[1] += p[1];
      acc[2] += p[2];
      n++;
    }
  }
  return acc.map((v) => Math.round(v / n));
}

// Hand-named palette. Each entry is the colour the cell snaps to and the
// character used in the sprite rows. "." is transparent.
const palette = [
  { ch: ".", name: "bg", rgb: [248, 243, 229] },
  { ch: "k", name: "wood", rgb: [72, 56, 40] },
  { ch: "t", name: "seat", rgb: [168, 152, 120] },
  { ch: "s", name: "seatDark", rgb: [136, 104, 72] },
  { ch: "C", name: "clawd", rgb: [216, 120, 88] },
  { ch: "c", name: "clawdScreen", rgb: [248, 226, 208] },
  { ch: "B", name: "bit", rgb: [40, 136, 136] },
  { ch: "b", name: "bitScreen", rgb: [208, 240, 240] },
  { ch: "T", name: "terminal", rgb: [72, 136, 72] },
  { ch: "D", name: "terminalDark", rgb: [40, 92, 52] },
  { ch: "e", name: "terminalScreen", rgb: [216, 248, 200] },
  { ch: "R", name: "block", rgb: [204, 40, 40] },
  { ch: "r", name: "blockScreen", rgb: [248, 200, 200] },
  { ch: "P", name: "loop", rgb: [104, 44, 120] },
  { ch: "p", name: "loopScreen", rgb: [232, 208, 240] },
  { ch: "w", name: "white", rgb: [248, 248, 248] },
];

function nearest(rgb) {
  let best = palette[0];
  let bd = Infinity;
  for (const p of palette) {
    const d = (rgb[0] - p.rgb[0]) ** 2 + (rgb[1] - p.rgb[1]) ** 2 + (rgb[2] - p.rgb[2]) ** 2;
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
}

const grid = [];
for (let y = 0; y < rows; y++) {
  let line = "";
  for (let x = 0; x < cols; x++) line += nearest(sample(x, y)).ch;
  grid.push(line);
}

// Split into slots halfway between the monitor tops, which are the long runs
// of wood on the first non-empty row. The desks touch, so empty columns
// would not do.
let top = rows;
let bottom = 0;
grid.forEach((line, y) => {
  if (/[^.]/.test(line)) {
    top = Math.min(top, y);
    bottom = Math.max(bottom, y + 1);
  }
});
const monitorRow = grid[top];
const runs = [];
for (let x = 0; x <= cols; x++) {
  const wood = x < cols && monitorRow[x] !== ".";
  if (wood && start === undefined) var start = x;
  if (!wood && start !== undefined) {
    if (x - start >= 8) runs.push([start, x]);
    start = undefined;
  }
}
if (runs.length !== 5) throw new Error(`expected 5 monitors, found ${runs.length}`);
const cuts = [0];
for (let i = 1; i < runs.length; i++) cuts.push(Math.round((runs[i - 1][1] + runs[i][0]) / 2));
cuts.push(cols);
console.log("cuts", cuts.join(" "));

// Within a slot every body tint is that agent's colour and every pale tint
// is its screen, whatever the sampler guessed. Wood and seat stay as they are.
const bodyChars = "CBTDRP";
const screenChars = "cbeprw";
const names = ["clawd", "bit", "terminal", "block", "loop"];
const normalise = (line) =>
  line
    .split("")
    .map((ch) => (bodyChars.includes(ch) ? "X" : screenChars.includes(ch) ? "S" : ch))
    .join("");

// Hand fixes applied after tracing. Clawd's reference pose has the claws in
// the air; at a desk they rest either side of the keyboard and become the
// hands that type. Rows and columns are in the trimmed sprite.
const fixups = {
  clawd: (lines) => {
    const set = (y, x0, x1, ch) => {
      const l = lines[y].split("");
      for (let x = x0; x <= x1; x++) l[x] = ch;
      lines[y] = l.join("");
    };
    // Clear the raised claws and the arms holding them up.
    for (let y = 10; y <= 14; y++) {
      set(y, 0, 6, ".");
      set(y, 23, 29, ".");
    }
    // Claws resting on the desk: two prongs, a wrist, and the tips on the wood.
    set(15, 1, 2, "X");
    set(15, 4, 5, "X");
    set(15, 24, 25, "X");
    set(15, 27, 28, "X");
    set(16, 1, 5, "X");
    set(16, 24, 28, "X");
    set(17, 2, 5, "X");
    set(17, 24, 27, "X");
    return lines;
  },
};

const sprites = names.map((id, i) => {
  const x0 = cuts[i];
  const x1 = cuts[i + 1];
  let lines = grid.slice(top, bottom).map((line) => normalise(line.slice(x0, x1)));
  // Trim empty columns on both sides but remember where the slot sits.
  let left = 0;
  while (left < x1 - x0 && lines.every((l) => l[left] === ".")) left++;
  let right = x1 - x0;
  while (right > left && lines.every((l) => l[right - 1] === ".")) right--;
  lines = lines.map((l) => l.slice(left, right));
  if (fixups[id]) lines = fixups[id](lines);
  return { id, x: x0 + left, width: right - left, height: bottom - top, rows: lines };
});

const hex = (name) =>
  palette
    .find((p) => p.name === name)
    .rgb.map((v) => v.toString(16).padStart(2, "0"))
    .join("");

const ts = `// Generated by scripts/trace-row.mjs from ${src}. Do not edit by hand.
// Each sprite is a grid of palette characters; "." is transparent.

// Characters: k wood, t seat, s seat shadow, X the agent's body, S its screen.

export const spriteWood = "#${hex("wood")}";
export const spriteSeat = "#${hex("seat")}";
export const spriteSeatDark = "#${hex("seatDark")}";

export type Sprite = { id: string; x: number; width: number; height: number; rows: string[] };

/** Width of the whole row in cells, so slots keep their spacing. */
export const crewRowWidth = ${cols};

export const crewSprites: Sprite[] = ${JSON.stringify(sprites, null, 2)};
`;
await writeFile(out, ts);

// Preview: every cell drawn as a crisp 8 px square.
const S = 8;
const pw = cols * S;
const ph = rows * S;
const buf = Buffer.alloc(pw * ph * 3);
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const p = palette.find((q) => q.ch === grid[y][x]) ?? palette[0];
    for (let yy = 0; yy < S; yy++) {
      for (let xx = 0; xx < S; xx++) {
        const i = ((y * S + yy) * pw + x * S + xx) * 3;
        buf[i] = p.rgb[0];
        buf[i + 1] = p.rgb[1];
        buf[i + 2] = p.rgb[2];
      }
    }
  }
}
await sharp(buf, { raw: { width: pw, height: ph, channels: 3 } }).png().toFile(preview);
console.log(`wrote ${out} and ${preview}`);
