import { describe, expect, test } from "vitest";
import { contrast } from "@/lib/contrast";
import { styleVariants } from "@/lib/style-variants";

describe("contrast", () => {
  test("black on white is 21:1 and white on white is 1:1", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrast("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("style variants", () => {
  test("proposes five variants with unique ids", () => {
    expect(styleVariants).toHaveLength(5);
    expect(new Set(styleVariants.map((v) => v.id)).size).toBe(5);
  });

  test("uses an 8px base for spacing", () => {
    for (const v of styleVariants) {
      expect(v.spacing.base).toBe(8);
      for (const step of v.spacing.steps) expect(step % 4).toBe(0);
    }
  });

  test.each(styleVariants.map((v) => [v.name, v] as const))(
    "%s keeps text readable (WCAG AA)",
    (_, v) => {
      const c = v.colors;
      expect(contrast(c.ink, c.bg)).toBeGreaterThanOrEqual(7);
      expect(contrast(c.ink, c.surface)).toBeGreaterThanOrEqual(7);
      expect(contrast(c.muted, c.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.onPrimary, c.primary)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.onSecondary, c.secondary)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c.accent, c.bg)).toBeGreaterThanOrEqual(3);
    },
  );

  test("every variant names a display and body font and a full type scale", () => {
    for (const v of styleVariants) {
      expect(v.type.display.family).toBeTruthy();
      expect(v.type.body.family).toBeTruthy();
      expect(v.type.scale.map((s) => s.name)).toEqual([
        "Display",
        "H1",
        "H2",
        "H3",
        "Lead",
        "Body",
        "Small",
        "Caption",
      ]);
    }
  });
});
