import { describe, expect, test } from "vitest";
import { copy, links } from "@/lib/copy";

const forbidden =
  /\b(orchestrat|seamless|supercharge|AI-powered|revolutionary|copilot|assistant|workflow)/i;

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}

describe("copy", () => {
  test("the headline opens with the verb the voice pill replaces", () => {
    expect(copy.hero.headline.split(" ")[0]).toBe("Talk");
  });

  test("uses the product's words and none of the banned ones", () => {
    for (const s of strings(copy)) expect(s).not.toMatch(forbidden);
  });

  test("has no exclamation marks and no em dashes", () => {
    for (const s of strings(copy)) {
      expect(s).not.toContain("!");
      expect(s).not.toContain("—");
    }
  });

  test("the download fallback is the releases list, which never 404s", () => {
    expect(links.releases).toBe(
      "https://github.com/TheLinc/open-room/releases",
    );
  });

  test("answers the four objections from the company brain", () => {
    const qs = copy.faq.items.map((i) => i.q.toLowerCase());
    for (const word of ["api key", "send", "microphone", "quota"]) {
      expect(qs.some((q) => q.includes(word))).toBe(true);
    }
  });
});
