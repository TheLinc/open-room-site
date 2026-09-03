// Crops the approved masters to a square around the room and writes web-sized files.
// The room sits at three quarters of every source frame's width; the rest is empty
// background that the page draws itself. The same crop is used for the hero video.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const IN = "assets/higgsfield/keyframes";
const OUT = "src/assets/room";

const ROOM_CENTRE_X = 0.75;
const MAX_SIDE = 1440;
const WEBP_QUALITY = 82;

const stills = [
  ["F1", `${IN}/hero/2k/F1-rest-atlas-working.png`],
  ["F4", `${IN}/hero/2k/F4-atlas-called.png`],
  ["S1", `${IN}/sections/2k/S1-name-them.png`],
  ["S2", `${IN}/sections/2k/S2-all-working.png`],
  ["S4", `${IN}/sections/S4-far-away.png`],
];

async function squareRegion(file) {
  const { width, height } = await sharp(file).metadata();
  const side = height;
  const left = Math.round(width * ROOM_CENTRE_X - side / 2);
  if (left < 0 || left + side > width) throw new Error(`${file}: square crop falls outside the frame`);
  return { left, top: 0, width: side, height: side };
}

await mkdir(OUT, { recursive: true });

for (const [id, file] of stills) {
  const r = await squareRegion(file);
  await sharp(file)
    .extract(r)
    .resize({ width: Math.min(r.width, MAX_SIDE) })
    .webp({ quality: WEBP_QUALITY })
    .toFile(`${OUT}/${id}.webp`);
  console.log(id, "from", file, r);
}

// PNG copy of the rest frame for the Open Graph route, which cannot read WebP.
{
  const [, file] = stills[0];
  const r = await squareRegion(file);
  await sharp(file).extract(r).resize({ width: 1200 }).png().toFile(`${OUT}/og-room.png`);
  console.log("og-room.png from", file);
}
