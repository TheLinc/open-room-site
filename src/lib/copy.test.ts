import { describe, expect, test } from "vitest";
import { copy } from "@/lib/copy";

describe("copy", () => {
  test("headline and button match the spec", () => {
    expect(copy.headline).toBe("Talk to your agents without leaving your window.");
    expect(copy.cta.button).toBe("Tell me when it's ready");
  });

  test("has four beats in spec order", () => {
    expect(copy.beats.map((b) => b.id)).toEqual(["name", "team", "command", "local"]);
  });
});
