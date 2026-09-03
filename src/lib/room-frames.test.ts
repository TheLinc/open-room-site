import { describe, expect, test } from "vitest";
import sharp from "sharp";
import { join } from "node:path";

const dir = join(process.cwd(), "src/assets/room");

async function size(file: string) {
  const meta = await sharp(join(dir, file)).metadata();
  return { width: meta.width, height: meta.height };
}

describe("room stills", () => {
  test("stills cut from the 2k masters are 1440 px squares, matching the loop", async () => {
    for (const file of ["F1.webp", "F4.webp", "S1.webp", "S2.webp"]) {
      expect(await size(file)).toEqual({ width: 1440, height: 1440 });
    }
  });

  test("the far-away still keeps its native square size", async () => {
    expect(await size("S4.webp")).toEqual({ width: 672, height: 672 });
  });

  test("the Open Graph source is a 1200 px square PNG", async () => {
    expect(await size("og-room.png")).toEqual({ width: 1200, height: 1200 });
  });
});
