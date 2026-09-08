import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { copy } from "@/lib/copy";
import { crew } from "@/lib/crew";

vi.mock("@/app/actions", () => ({
  joinWaitlist: vi.fn(async () => ({ status: "ok" })),
}));

// jsdom has no matchMedia; the reduced-motion hook needs one.
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
}));
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    disconnect() {}
  },
);

import {
  LampHero,
  splitHeadline,
  splitVerb,
} from "@/components/lamp/lamp-hero";

describe("splitHeadline", () => {
  test("sets the second half of the headline in italic", () => {
    expect(
      splitHeadline("Talk to your agents without leaving your window."),
    ).toEqual(["Talk to your agents ", "without leaving your window."]);
  });

  test("leaves a headline without the phrase alone", () => {
    expect(splitHeadline("Something else.")).toEqual(["Something else.", ""]);
  });
});

describe("splitVerb", () => {
  test("peels the first word off and keeps the space with the rest", () => {
    expect(splitVerb("Talk to your agents ")).toEqual([
      "Talk",
      " to your agents ",
    ]);
  });
});

describe("LampHero", () => {
  afterEach(cleanup);

  test("renders the headline, the lead, the crew and the waitlist form", () => {
    render(<LampHero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(copy.headline);
    expect(h1.querySelector("em")?.textContent).toBe(
      "without leaving your window.",
    );
    // The verb is a waveform pill with the word kept for screen readers.
    expect(h1.querySelector(".lamp-voice .sr-only")?.textContent).toBe("Talk");
    expect(screen.getByText(copy.subheadline)).toBeDefined();
    expect(screen.getByRole("img", { name: copy.crew.alt })).toBeDefined();
    for (const member of crew)
      expect(screen.getByText(member.name)).toBeDefined();
    expect(screen.getByLabelText(copy.cta.label)).toBeDefined();
    expect(screen.getByRole("button", { name: copy.cta.button })).toBeDefined();
  });
});
