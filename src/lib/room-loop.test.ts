import { describe, expect, test } from "vitest";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import loop from "@/assets/room/loop.json";

const MAX_BYTES = 3 * 1024 * 1024;

describe("room loop", () => {
  test("is a five second 1080 px square", () => {
    expect(loop.width).toBe(1080);
    expect(loop.height).toBe(1080);
    expect(loop.duration).toBeGreaterThan(4.9);
    expect(loop.duration).toBeLessThan(5.2);
    expect(loop.frames).toBeGreaterThanOrEqual(120);
  });

  test("both encodes exist and are small enough for a hero", async () => {
    const mp4 = await stat(join(process.cwd(), "public/room/loop.mp4"));
    const webm = await stat(join(process.cwd(), "public/room/loop.webm"));
    expect(mp4.size).toBe(loop.mp4Bytes);
    expect(webm.size).toBe(loop.webmBytes);
    expect(mp4.size).toBeLessThan(MAX_BYTES);
    expect(webm.size).toBeLessThan(MAX_BYTES);
  });
});
